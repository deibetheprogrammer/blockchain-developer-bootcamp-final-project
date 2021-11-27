const Lottery = artifacts.require("Lottery");
let { catchRevert } = require("./exceptionsHelpers.js");
const { items: ItemStruct, isDefined, isPayable, isType } = require("./ast-helper");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Lottery", function (accounts) {
  const [_owner, alice, bob] = accounts;
  const emptyAddress = "0x0000000000000000000000000000000000000000";

  let instance;

  beforeEach(async () => {
    instance = await Lottery.new();
  });

  /*
  These tests verify that the variable "owner" and the enum State
  are present in the code.
  */
  describe("Variables", () => {
    it("should have an owner", async () => {
      assert.equal(typeof instance.owner, 'function', "the contract has no owner");
    });

    /*
    This test verifies that the enum "State" contains the following values:
    initial,oneBet,twoBet,requestRandomNum and completed
    */
    describe("enum State", () => {
      let enumState;
      before(() => {
        enumState = Lottery.enums.State;
        assert(
          enumState,
          "The contract should define an Enum called State"
        );
      });

      it("should define `initial`", () => {
        assert(
          enumState.hasOwnProperty('initial'),
          "The enum does not have a `initial` value"
        );
      });

      it("should define `oneBet`", () => {
        assert(
          enumState.hasOwnProperty('oneBet'),
          "The enum does not have a `oneBet` value"
        );
      });

      it("should define `twoBet`", () => {
        assert(
          enumState.hasOwnProperty('twoBet'),
          "The enum does not have a `twoBet` value"
        );
      });

      it("should define `waitingRandomNum`", () => {
        assert(
          enumState.hasOwnProperty('waitingRandomNum'),
          "The enum does not have a `waitingRandomNum` value"
        );
      });

      it("should define `completed`", () => {
        assert(
          enumState.hasOwnProperty('completed'),
          "The enum does not have a `completed` value"
        );
      });
    })
  }); 

  // The following tests verify functionality within the contract
  describe("Use cases", () => {

  /* This test verifies that everything is in order when the first bet is placed:
  correct values for state, participant1, participant2, winner and lotteryCount
  */
    it("should place a bet for the sender", async () => {
      await instance.placeBet({value: 1e9, from: alice });

      const result = await instance.requestData.call();

      assert.equal(
        result[0],
        1,
        "Lottery state should be oneBet",
      );
      assert.equal(
        result[1],
        alice,
        "Participant1 should be the sender",
      );
      assert.equal(
        result[2],
        emptyAddress,
        'Participant2 should be empty',
      );
      assert.equal(
        result[3],
        emptyAddress,
        'Winner should be empty',
      );
      assert.equal(
        result[4],
        1,
        "LotteryCount should be 1",
      );
    });

    // This test verifies that an event is emitted when a bet is placed
    it("should emit a LogBetPlaced event when a bet is placed", async () => {
      let eventEmitted = false;
      const tx = await instance.placeBet({value:1e9, from: alice });

      if (tx.logs[0].event == "LogBetPlaced") {
        eventEmitted = true;
      }

      assert.equal(
        eventEmitted,
        true,
        "Placing a bet should a emit a Bet Placed event",
      );
    });

    // This test verifies that an error occurs when not enough value is sent for a bet
    it("should error when not enough value is sent when placing a bet", async () => {
      await catchRevert(instance.placeBet({ from: bob, value: 0}));
    });

    /*
    This test verifies that an error occurs when someone tries to claim the prize when
    a winner hasn't yet been elected.
    */
    it("should error when requestPot is called in a state other than completed", async () => {
      await catchRevert(instance.requestPot({ from: bob }));
    });

    /*
    This test verifies that an error occurs when someone who is not the owner tries to claim
    this contract's gains.
    */
    it("should error when requestGains is not called by owner", async () => {
      await catchRevert(instance.requestGains({ from: bob }));
    });

  });
});
