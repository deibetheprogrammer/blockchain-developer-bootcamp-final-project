# Design patterns used

## Access Control Design Patterns

- `Ownable` design pattern used in `requestGains` function. This function doesn't need to be used by anyone else apart from the contract creator, i.e. the party that is responsible for managing the Lottery.

## Inheritance and Interfaces

- `Lottery` contract inherits the OpenZeppelin `Ownable` contract to enable ownership for one managing user/party.

## Oracles

- This contract requests a random number from Chainlink