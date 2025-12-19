# erc721-ux

## How to run the project

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- MetaMask installed in your browser
- Sepolia network configured in MetaMask

### Installation and launch

1. **Install frontend dependencies** :
```bash
cd frontend
npm install
```

2. **Start the development server** :
```bash
npm run dev
```

3. **Open the application** :
   - Open your browser and go to [http://localhost:3000](http://localhost:3000)
   - Make sure MetaMask is connected to the Sepolia network

### Build for production

```bash
cd frontend
npm run build
npm start
```

## Intro

Your job is to build a simple UX to visualize and manipulate ERC721 Tokens.

This repo contains the references (code + ABI) for two ERC721 tokens deployed on the Sepolia testnet, which you'll need to use.

- [Fake BAYC](contracts/FakeBAYC.sol) ( 0x1dA89342716B14602664626CD3482b47D5C2005E on Sepolia ) (get the [ABI](build/contracts/FakeBAYC.json))
- [Fake Nefturians](contracts/FakeNefturians.sol) (0x9bAADf70BD9369F54901CF3Ee1b3c63b60F4F0ED on Sepolia ) (get the [ABI](build/contracts/FakeNefturians.json))
- [Fake Meebits](contracts/FakeMeebits.sol) (0xD1d148Be044AEB4948B48A03BeA2874871a26003 on Sepolia ) (get the [ABI](build/contracts/FakeMeebits.json))
- [Fake Meebits Claimer](contracts/FakeMeebitsClaimer.sol) (0x5341e225Ab4D29B838a813E380c28b0eFD6FBa55 on Sepolia ) (get the [ABI](build/contracts/FakeMeebitsClaimer.json))

To get started using these tokens, I suggest you use the truffle generated ABI and MyCrypto or to visit Etherscan in order to claim/buy a token for each.

## Tasks list

### Creating a js app and connecting to Ethereum

- Create a repo to host your work
- Create a React / Vue JS app and create a page /chain-info(2 pts)
- Connect your app to the Sepolia network through Metamask and display the ChainId, the last block number, and user address on /chain-info (2 pts)
- Show an error page and redirect user to it if the chain is not Sepolia (1 pt)

### Calling read and write functions

- Create a page /fakeBayc
- Display the name and the total token number (2 pts)
- Create a button to claim a new token for the current user(2 pts)
- Create a page /fakeBayc/{tokenId}
- Display the informations (image and all the attributes) referenced in the Metadata URI for token {tokenId} (2 pts)
- Show a clean error message on /fakeBayc/{tokenId} if the token does not exist (1pt)

### Paying through functions

- Create a page /fakeNefturians
- Display the minimum token price, and create a button to buy a token (this one needs to be paid for) (2 pts)
- Create a page /fakeNefturians/{userAddress}
- Display all the tokens {userAddress} id's has with nft name and description from metadata and token

### Calling a minter with a signature

- Create a page /fakeMeebits
- Create a button to mint a token.
- Read the contract
- Let the user pick a token number that wasn't minted yet
- use [signature data](claimerV1-tools) to call function `claimAToken()` on [fake meebits claimer](contracts/FakeMeebits.sol) correctly (4 pts)

### Bonus

- Deploy your static web site (2 pts)
