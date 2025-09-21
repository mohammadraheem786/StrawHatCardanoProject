StrawHat Cardano Project 🏴‍☠️
StrawHat is a powerful React-based toolkit for Cardano DApp development. It provides a robust starting point for connecting to user wallets, building transactions, and interacting with Plutus smart contracts directly from the frontend.

This project was bootstrapped with Create React App and leverages the CIP-30 standard and cardano-serialization-lib to create a seamless developer experience.

Project Presentation Deck
The complete vision, architecture, and goals of the StrawHat Project are detailed in our presentation deck.

➡️ View the Project Presentation on Google Drive

(Recommendation: Add a key screenshot from your presentation here, like an architecture diagram or a title slide.)
![StrawHat Architecture](link-to-your-image.png)

Table of Contents
Key Features

How It Works

Getting Started

Prerequisites

Installation

Live Demos

Troubleshooting

Vasil Hard Fork & Cost Models

Developer Resources

Key Features
Wallet Integration: Connect to popular CIP-30 compliant wallets like Eternl, Nami, Flint, and more.

On-chain Data: Read wallet balance, UTXOs, and native tokens (NFTs).

Transaction Building: Construct, sign, and submit complex transactions directly from the client-side.

Send ADA to any address.

Send native tokens (NFTs) to any address.

Smart Contract Interaction:

Lock ADA and Tokens at a Plutus Script address.

Redeem ADA and Tokens from a Plutus Script.

How It Works
The toolkit uses a powerful combination of industry standards to minimize backend complexity:

CIP-30 Wallet Standard: It provides a unified interface to communicate with the user's chosen wallet for actions like fetching addresses, UTXOs, and requesting transaction signatures.

Cardano Serialization Lib: This library allows for all off-chain transaction-building logic to be written in JavaScript. This greatly reduces the amount of Haskell code needed and avoids direct interaction with the Plutus Application Backend (PAB).

This project uses the alwayssucceeds.plutus smart contract as an example, which has a fixed testnet address of:
addr_test1wpnlxv2xv9a9ucvnvzqakwepzl9ltx7jzgm53av2e9ncv4sysemm8

Getting Started
Prerequisites
Node.js: Version v14.0 or higher.

NPM/Yarn: A JavaScript package manager.

Installation
Clone the repository:

Bash

git clone https://github.com/your-username/StrawHatCardanoProject.git
Navigate to the project directory:

Bash

cd StrawHatCardanoProject
Install dependencies:

Bash

npm install
Run the application:

Bash

npm start
The app will launch in development mode. Open http://localhost:3000 to view it in your browser.

Live Demos
Generic Wallet Connector Demo: https://dynamicstrategies.io/wconnector

Cardano Beam (Working Integration): https://cardanobeam.app/web

Troubleshooting
JavaScript heap out of memory: If you see this error, run the following command in your terminal before starting the app:

Bash

export NODE_OPTIONS="--max-old-space-size=8192"
Not enough ADA leftover...: This error occurs when the wallet cannot construct a valid change output.

Ensure you have sufficient ADA in your wallet (more than 5-10 ADA is recommended).

Try changing the UTXO selection strategy. In the code, find txBuilder.add_inputs_from(txUnspentOutputs, strategy) and change the strategy number:

0: LargestFirst

1: RandomImprove (Recommended as a first try)

2: LargestFirstMultiAsset

3: RandomImproveMultiAsset

Vasil Hard Fork & Cost Models
The Vasil hard fork introduced an updated Plutus cost model, affecting the fees required to execute smart contracts. This repository is up-to-date with the post-Vasil cost model and will work correctly on the Mainnet and modern testnets.

If you need to operate on a network using the pre-Vasil cost model, you must comment out the current cost_model_vals and uncomment the old one within the code.

Post-Vasil Cost Model (Active by Default)
JavaScript

const cost_model_vals = [
    205665, 812, 1, 1, 1000, 571, 0, 1, 1000, 24177, 4, 1, 1000, 32, 117366,
    10475, 4, 23000, 100, 23000, 100, 23000, 100, 23000, 100, 23000, 100, 23000,
    100, 100, 100, 23000, 100, 19537, 32, 175354, 32, 46417, 4, 221973, 511, 0, 1,
    89141, 32, 497525, 14068, 4, 2, 196500, 453240, 220, 0, 1, 1, 1000, 28662, 4,
    2, 245000, 216773, 62, 1, 1060367, 12586, 1, 208512, 421, 1, 187000, 1000,
    52998, 1, 80436, 32, 43249, 32, 1000, 32, 80556, 1, 57667, 4, 1000, 10,
    197145, 156, 1, 197145, 156, 1, 204924, 473, 1, 208896, 511, 1, 52467, 32,
    64832, 32, 65493, 32, 22558, 32, 16563, 32, 76511, 32, 196500, 453240, 220, 0,
    1, 1, 69522, 11687, 0, 1, 60091, 32, 196500, 453240, 220, 0, 1, 1, 196500,
    453240, 220, 0, 1, 1, 806990, 30482, 4, 1927926, 82523, 4, 265318, 0, 4, 0,
    85931, 32, 205665, 812, 1, 1, 41182, 32, 212342, 32, 31220, 32, 32696, 32,
    43357, 32, 32247, 32, 38314, 32, 9462713, 1021, 10,
];
Developer Resources
Cardano Developer Portal Guide: Create a React DApp with the Serialization Lib

CIP-30 Specification: Cardano Wallet Connector Standard

Cardano Serialization Lib Repo: Official Emurgo GitHub Repository

Nami Wallet (Example Implementation): Nami Wallet GitHub