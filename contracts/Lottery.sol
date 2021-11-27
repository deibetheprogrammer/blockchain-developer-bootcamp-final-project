// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

/**
@title A simple Lottery
@author David A. Bendeck
 */

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "@OpenZeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract Lottery is Ownable, VRFConsumerBase {
    // STATE VARIABLES

    address vrfCoordinator = 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B;
    bytes32 private s_keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
    uint256 private s_fee = 1e17;
    address link = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;

    uint gains;
    uint256 lotteryCount;
    address participant1;
    address participant2;
    address payable winner;
    State state;

    enum State {
        initial,
        oneBet,
        twoBet,
        waitingRandomNum,
        completed
    }

    // EVENTS

    event LogBetPlaced(uint256 _bet, address _participant, State _state);

    event LogRandomNumRequest(State _state);

    event LogWinnerElected(uint256 _num, address _winner, State _state);

    event PotCollected(address _winner, uint _pot);

    event GainsCollected(address _owner, uint _gains);

    // MODIFIERS

    modifier verifyState() {
        require(
            state == State.initial || state == State.oneBet,
            "You cannot place bets"
        );
        _;
    }

    modifier verifyAmount() {
        require(msg.value == 1e9, "You must bet exactly 1 gwei");
        _;
    }

    modifier verifyCompleted() {
        require(state == State.completed, "State is not completed");
        _;
    }

    modifier onlyWinner() {
        require(msg.sender == winner, "You are not the winner");
        _;
    }

    modifier verifyInitial() {
        require(state == State.initial, "State is not initial");
        _;
    }

    // FUNCTIONS

    constructor() VRFConsumerBase(vrfCoordinator, link) {
        lotteryCount = 1;
    }

    function deposit() public payable {}

    /**
    @notice Allows users to place their bets
     */
    function placeBet() public payable verifyState verifyAmount {
        gains += 1e8;
        if (state == State.initial) {
            participant1 = msg.sender;
            state = State.oneBet;
        } else {
            participant2 = msg.sender;
            state = State.twoBet;

            require(
                LINK.balanceOf(address(this)) >= s_fee,
                "Not enough LINK to pay fee"
            );
            state = State.waitingRandomNum;
            requestRandomness(s_keyHash, s_fee);

            emit LogRandomNumRequest(state);
        }

        emit LogBetPlaced(msg.value, msg.sender, state);
    }

    /**
    @notice Elects a winner
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        uint256 num = randomness % 2;
        if (num == 0) {
            winner = payable(participant1);
        } else {
            winner = payable(participant2);
        }

        state = State.completed;

        emit LogWinnerElected(num, winner, state);
    }

    /**
    @notice Allows the winner to claim the prize
     */
    function requestPot() public verifyCompleted onlyWinner {
        participant1 = address(0);
        participant2 = address(0);
        winner = payable(address(0));
        state = State.initial;
        lotteryCount += 1;

        (bool sent, ) = msg.sender.call{value: 18e8}("");
        require(sent, "Failed to send Ether");

        emit PotCollected(msg.sender, 18e8);
    }

     /**
    @notice Requests the contract's gains
     */

    function requestGains()
        public
        onlyOwner
    {
        uint tgains = gains;
        gains = 0;
        (bool sent, ) = msg.sender.call{value: tgains }("");
        require(sent, "Failed to send Ether");

        emit GainsCollected(msg.sender, tgains);
    }


    /**
    @notice Requests the contracts current state
     */
    function requestData()
        public
        view
        returns (
            State,
            address,
            address,
            address,
            uint256
        )
    {
        return (state, participant1, participant2, winner, lotteryCount);
    }

    function destroyContract() public onlyOwner {
        selfdestruct(payable(msg.sender));
    }
}