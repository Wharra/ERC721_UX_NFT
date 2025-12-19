# ERC721 UX Frontend

A professional Next.js application for interacting with ERC721 tokens on the Sepolia testnet.

## Features

- ✅ Chain information page with network validation
- ✅ Fake BAYC collection with token claiming
- ✅ Fake Nefturians collection with token purchasing
- ✅ Fake Meebits collection with signature-based minting
- ✅ Token detail pages with metadata display
- ✅ User token collection viewer
- ✅ Wrong network detection and redirection
- ✅ Modern, responsive UI with Tailwind CSS

## Getting Started

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── chain-info/          # Network information page
│   ├── fakeBayc/            # BAYC collection pages
│   ├── fakeNefturians/      # Nefturians collection pages
│   ├── fakeMeebits/         # Meebits minting page
│   └── wrong-network/       # Network error page
├── components/
│   └── Navbar.tsx           # Navigation component
├── hooks/
│   └── useWeb3.tsx          # Web3 connection hook
└── lib/
    ├── contracts.ts         # Contract addresses and ABIs
    └── signatures.ts        # Signature utilities
```

## Requirements

- Node.js 18+
- MetaMask browser extension
- Sepolia testnet network configured in MetaMask

## Contract Addresses (Sepolia)

- Fake BAYC: `0x1dA89342716B14602664626CD3482b47D5C2005E`
- Fake Nefturians: `0x9bAADf70BD9369F54901CF3Ee1b3c63b60F4F0ED`
- Fake Meebits: `0xD1d148Be044AEB4948B48A03BeA2874871a26003`
- Fake Meebits Claimer: `0x5341e225Ab4D29B838a813E380c28b0eFD6FBa55`

