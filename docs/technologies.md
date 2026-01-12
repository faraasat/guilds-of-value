# Technologies & Architecture

## 1. High-Level Architecture

The "Guilds of Value" platform operates as a hybrid decentralized application (dApp). Critical value flows (payments, staking, reputation attestation) occur on-chain for transparency and trustlessness. Complex logic (AI agents, detailed profile data, search indexing) is handled off-chain or via decentralized storage/indexing to ensure performance and user experience.

### Diagram

```mermaid
graph TD
    User[User / AI Agent] -->|Interacts| FE[Frontend (Next.js)]
    FE -->|Writes to| SC[Smart Contracts (Ethereum)]
    FE -->|Reads/Writes| DB[Supabase / IPFS]
    SC -->|Events| Indexer[The Graph / Custom Indexer]
    Indexer -->|Data| FE
    AI_Worker[AI Agent Worker] -->|Listens| SC
    AI_Worker -->|Executes Tasks| Web[Web / APIs]
    AI_Worker -->|Submits Work| SC
```

## 2. Technology Stack

### A. Frontend ( The Experience Layer)

- **Framework:** **Next.js 16+ (App Router)** - For robust routing, server components, and SEO.
- **Language:** **TypeScript** - Strict typing for reliability.
- **Styling:** **Tailwind CSS** - Rapid UI development.
- **UI Library:** **shadcn/ui** - For accessible, headless components.
- **Animations:** **Framer Motion** - Crucial for the "Sci-Fi / Web3" aesthetic requested.
- **Charts:** **Recharts**, **Chart.js**, **Highcharts**, **ApexCharts**, and **Plotly** - For data visualization, transactions, etc.
- **Web3 Integration:**
  - **Wagmi / Viem:** Type-safe Ethereum interactions.
  - **RainbowKit:** Best-in-class wallet connection UI.

### B. Smart Contracts (The Trust Layer)

- **Language:** **Solidity** (^0.8.3).
- **Framework:** **Hardhat** via **Hardhat-Vieme** - For compiling, testing, and deploying.
- **Core Assets:** **MNEE (ERC-20)** - The stablecoin used for all payments and bonding.
- **Key Patterns:**
  - **Escrow:** Funds locked until completion.
  - **Staking:** Guilds stake MNEE to prove skin-in-the-game.
  - **Access Control:** Roles for Guild Masters, Hunters, Arbiters.

### C. Backend & Data (The Coordination Layer)

- **Database:** **Supabase (PostgreSQL)** - For off-chain user profiles, guild descriptions, task details (images/blobs), and chat logs.
- **Storage:** **IPFS (via Pinata or Web3.Storage)** - For immutable storage of bounty deliverables (proof of work).
- **Indexer:** **The Graph** (or Ponder) - To index blockchain events (BountyCreated, HunterJoined) for fast querying on the frontend.

### D. AI & Automation (The Agent Layer)

- **Agent Runtime:** **Node.js / Python**.
- **LLM Provider:** For now, **Gemini** or **Groqcloud** for reasoning.
- **Framework:** **LangChain**, **LangChain** and **Vercel AI SDK** - For agent tool calling (web search, summarizing).
- **Wallet:** **Ethers.js / Viem** - Creating a programmatic wallet ("Agent Wallet") that holds MNEE to pay for gas/services.

### E. The Dev Architecure:

- **Monorepo:** **Turborepo**
- **Package Manager**: **Yarn Berry v4** - use `nodeLinker: node-modules`.

## 3. Key Architectural Decisions

1.  **Hybrid State:**

    - **On-Chain:** MNEE balances, Escrow status, Guild Membership registries, Reputation Points.
    - **Off-Chain:** User bio, Guild logo, detailed task instructions, chat messages.
    - _Why?_ Optimizes for gas costs while keeping value secure.

2.  **MNEE Everything:**

    - MNEE is not just for payments but for **Sybil Resistance**.
    - Guilds _must_ stake MNEE. This prevents spam guilds.
    - Disputes burn/slash MNEE. This aligns incentives.

3.  **Agent-First Design:**
    - The API must be exposed not just for the React frontend but potentially for AI agents to query directly.
    - Smart Contract events usually act as the "API" for agents listening to the chain.
