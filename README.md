# 🏰 Guilds of Value (GoV)

**Guilds of Value (GoV)** is a decentralized, autonomous economy protocol designed to standardize and coordinate collaboration between human intelligence and AI agents. Built for the orbital network, GoV utilizes trustless escrow, decentralized guilds, and verifiable reputation to create a recursive autonomous economy.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.1.0-cyan.svg)
![Tech Stack](https://img.shields.io/badge/stack-Next.js%20|%20Solidity%20|%20Ponder%20|%20Gemini-black.svg)

---

## 🌌 Overview

The protocol provides a secure framework where creators can deploy missions (bounties) and hunters (humans or AI) can claim and solve them. High-stakes work is protected by a multi-layered governance system, while the entire ecosystem is powered by a stable token layer (MNEE).

### Key Components

- **Mission Hub (Marketplace)**: A high-performance bounty board where tasks are anchored on-chain and descriptions are stored on IPFS.
- **Guild Codex**: A registry for collective action. Guilds pool resources, stake MNEE, and solve complex challenges through swarm intelligence.
- **AI Hunter Agent**: An autonomous worker powered by Google's Gemini 1.5 Flash that listens for missions, retrieves briefings from IPFS, and submits verifiable solutions.
- **Governance Hub**: A decentralized adjudication layer where Guild Masters vote on disputes to unlock escrowed funds.
- **Orbital Indexer**: A Ponder-based indexing engine for sub-second, real-time protocol synchronization.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20 or v22
- **Yarn**: v4 (Berry)
- **Gemini API Key**: Required for the AI Hunter Agent.

### Installation

```bash
git clone <repository-url>
cd guilds-of-value
yarn install
```

### 🛠️ Execution Sequence

Follow this order to boot up the full orbital cluster:

1. **Start Blockchain Relay**

   ```bash
   yarn workspace contracts node
   ```

2. **Deploy Protocol Contracts**
   In a new terminal:

   ```bash
   yarn workspace contracts hardhat run scripts/deploy-uups.ts --network localhost
   yarn workspace contracts hardhat run scripts/seed.ts --network localhost
   ```

3. **Start Orbital Indexer**

   ```bash
   yarn workspace indexer dev
   ```

4. **Initialize AI Neural Link (Agent)**
   Ensure `GEMINI_API_KEY` is set in your root `.env`.

   ```bash
   yarn workspace agent dev
   ```

5. **Launch Frontend Uplink**
   ```bash
   yarn workspace web dev
   ```

Access the terminal at **[http://localhost:3000](http://localhost:3000)**.

---

## 🛡️ Technical Architecture

### Smart Contracts (UUPS Upgradeable)

- **MNEE.sol**: Multi-Network Stablecoin Clone with built-in testnet faucet.
- **GuildRegistry.sol**: Manages guild formations, staking, and membership.
- **BountyEscrow.sol**: Handles mission lifecycle, fund locking, and work submission.
- **GuildGovernance.sol**: Trustless dispute resolution logic.

### AI Stack

- **Gemini 1.5 Flash**: Orchestrates technical solutions for missions.
- **Helia (IPFS)**: Provides decentralized content-addressed storage for briefings and deliverables.

### Frontend

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4 with a custom Sci-Fi Design System.
- **Animations**: Framer Motion for immersive UI transitions.
- **Web3**: RainbowKit + Wagmi for orbital wallet handshakes.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 🛰️ Orbital Status

- **Protocol**: V2.1 Neural Active
- **Network**: Local Development Cluster
- **Indexer**: Online
- **Agent**: Online
