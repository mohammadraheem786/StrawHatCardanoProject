# StrawHat Cardano Wallet Connector 🏴‍☠️

**Team:** India Codecs 2025  
**Project:** StrawHat Cardano Wallet Connector  

**Description:**  
StrawHat is a powerful React-based toolkit for Cardano DApp development. It provides a robust starting point for connecting to user wallets, building transactions, and interacting with Plutus smart contracts directly from the frontend.

This project was bootstrapped with **Create React App** and leverages the **CIP-30 standard** and **cardano-serialization-lib** to create a seamless developer experience.

---

## Project Presentation Deck

The complete vision, architecture, and goals of the StrawHat Project are detailed in our presentation deck:

➡️ [View the Project Presentation on Google Drive](INSERT_YOUR_GOOGLE_DRIVE_LINK_HERE)

*Recommendation: Add a key screenshot from your presentation here, like an architecture diagram or title slide.*

![StrawHat Architecture](link-to-your-image.png)

---

## Table of Contents

- [Key Features](#key-features)  
- [How It Works](#how-it-works)  
- [Getting Started](#getting-started)  
- [Prerequisites](#prerequisites)  
- [Installation](#installation)  
- [Live Demos](#live-demos)  
- [Troubleshooting](#troubleshooting)  
- [Vasil Hard Fork & Cost Models](#vasil-hard-fork--cost-models)  
- [Developer Resources](#developer-resources)

---

## Key Features

- **Wallet Integration:** Connect to popular CIP-30 compliant wallets like Eternl, Nami, Flint, and more.  
- **On-chain Data:** Read wallet balance, UTXOs, and native tokens (NFTs).  
- **Transaction Building:** Construct, sign, and submit complex transactions directly from the client-side.  
- **Send ADA** to any address.  
- **Send native tokens (NFTs)** to any address.  
- **Smart Contract Interaction:**  
  - Lock ADA and Tokens at a Plutus Script address.  
  - Redeem ADA and Tokens from a Plutus Script.

---

## How It Works

The toolkit uses a combination of industry standards to minimize backend complexity:

- **CIP-30 Wallet Standard:** Provides a unified interface to communicate with the user's wallet for fetching addresses, UTXOs, and signing transactions.  
- **Cardano Serialization Lib:** Enables off-chain transaction building in JavaScript, avoiding direct interaction with the Plutus Application Backend (PAB).  

> This project uses the `alwayssucceeds.plutus` smart contract as an example, with a fixed testnet address:  
> `addr_test1wpnlxv2xv9a9ucvnvzqakwepzl9ltx7jzgm53av2e9ncv4sysemm8`

---

## Getting Started

### Prerequisites

- **Node.js:** Version 14.0 or higher  
- **NPM/Yarn:** JavaScript package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/mohammadraheem786/StrawHatCardanoProject.git
Navigate to the project directory:

bash
Copy code
cd StrawHatCardanoProject
Install dependencies:

bash
Copy code
npm install
Run the application:

bash
Copy code
npm start
Open http://localhost:3000 in your browser.

Live Demos
Generic Wallet Connector Demo: https://dynamicstrategies.io/wconnector

Cardano Beam Integration: https://cardanobeam.app/web

Troubleshooting
JavaScript heap out of memory: Run:

bash
Copy code
export NODE_OPTIONS="--max-old-space-size=8192"
Not enough ADA leftover: Ensure the wallet has sufficient ADA (>5-10 ADA recommended). Adjust the UTXO selection strategy:

javascript
Copy code
txBuilder.add_inputs_from(txUnspentOutputs, strategy)
Strategies:

0: LargestFirst

1: RandomImprove (Recommended)

2: LargestFirstMultiAsset

3: RandomImproveMultiAsset

Vasil Hard Fork & Cost Models
This repo is updated with the post-Vasil cost model and works on mainnet and testnets.

Pre-Vasil network? Comment out cost_model_vals and use the old cost model.

Post-Vasil Cost Model (Active)

javascript
Copy code
const cost_model_vals = [
  205665, 812, 1, 1, 1000, 571, 0, 1, 1000, 24177, 4, 1, 1000, 32, 117366,
  10475, 4, 23000, 100, 23000, 100, 23000, 100, ...
];
Developer Resources
Cardano Developer Portal Guide

CIP-30 Wallet Connector Specification

Cardano Serialization Lib (Emurgo)

Nami Wallet Example Implementation

