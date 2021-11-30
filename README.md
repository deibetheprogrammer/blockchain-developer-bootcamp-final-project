# Final Project - Simple Lottery

## Deployed version url:

https://deibetheprogrammer.github.io

## How to run this project locally:

### Prerequisites

- Node.js >= v14
- Truffle and Ganache
- npm
- `git`

### Contracts

- Clone repository `git clone https://github.com/deibetheprogrammer/blockchain-developer-bootcamp-final-project.git` 
- Run `npm install` in project root to install dependencies
- Run `ganache-cli` on port `8545` for local tests
- Add this local testnet to Metamask http://127.0.0.1:port/ with Chain Id 1337 (see line above for port), truffle develop uses 9545, ganache-cli uses by default port 8545
- run `touch .rinkeby`
- run `touch .secret`
- `truffle migrate --network development`
- `truffle console --network development`
- Run tests in Truffle console: `test`
- `development` network id is 5337 and Chain Id (the one used to configure Metamask)  is 1337 .

### Frontend

- `cd client`
- `npm install`
- `npm start`
- Open `http://127.0.0.1:8080`
- Due to the use of Oracles, not all functionality can be tested on a local testnet
- Your local copy will only have the addresses of contracts that you deploy, so unless you deploy the `Lottery` contract on Rinkeby testnet or add the network and address on `Lottery.json`, the local copy of the frontend will only know the address of the local testnet.
## Screencast link

https://youtu.be/8TmQwLZ83vk

## Project description

This is a simple lottery that allows two users to place their bets. The contract then selects a winner and distributes the money between the winner and the owner of the contract.

## Simple workflow

1. Participant #1 enters the site and places his bet
2. Participant #2 does the same as Participant #1
3. The contract randomly selects a winner
4. The winner retrieves his prize
5. The owner claims his gains


## Directory structure

- `client`: Contains the files for the frontend.
- `contracts`: Smart contracts that are deployed in the Ropsten testnet.
- `migrations`: Migration files for deploying contracts in `contracts` directory.
- `test`: Tests for smart contracts.

## deployment on external  with Truffle
2 additional files (not incuded) are needed to deploy in Rinkeby testnet:

1. .rinkeby which contains the Infura project's URL
2. .secret which contains a wallet's mneumonics, this wallet has to have sufficient test ETH on it's first account.