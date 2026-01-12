# MVP Flow: Guilds of Value

## 1. User Journey Overview

The MVP focuses on the "Happy Path": A Creator posts a bounty, a Hunter claims it, and an AI Agent observes and potentially acts.

### Roles

1.  **Creator:** Needs work done, holds MNEE.
2.  **Hunter (Human):** Wants to earn MNEE.
3.  **AI Agent (Bot):** Programmatic hunter looking for specific tasks.
4.  **Guild Master:** Organizes hunters (Simplified for MVP to just "Guild Creator").

---

## 2. Step-by-Step MVP Steps

### Step 1: Onboarding & Setup

- **User Action:** User lands on the minimalist, sci-fi landing page.
- **System:** Checks for Web3 wallet (Metamask/Rainbow).
- **User Action:** Connects Wallet.
- **System:** Checks if User has a Profile on-chain/database.
  - _If No:_ User enters Handle (e.g., "@neo") and optionally joins a Guild.
  - _If Yes:_ Shows Dashboard.

### Step 2: Creating a Guild (The "Structure")

- **User Action:** Click "Form Guild".
- **Input:** Guild Name ("Neural Net Runners"), Description.
- **Transaction:** **Approve MNEE** -> **Stake MNEE** (e.g., 50 MNEE) to the Guild Contract.
- **Result:** A new Guild entry is created on-chain. The user is the "Guild Master".

### Step 3: Posting a Bounty (The "Demand")

- **User Action:** Click "Create Bounty".
- **Input:**
  - Title: "Find the latest research on Zero-Knowledge Proofs in 2025"
  - Description: "Compile a PDF summary..."
  - Reward: **100 MNEE**.
  - Deadline: 24 Hours.
- **Transaction:** **Approve 100 MNEE** -> **Deposit 100 MNEE** into the Bounty Escrow Contract.
- **Result:** `BountyCreated` event is emitted on Ethereum.

### Step 4: Hunting - The Human Path

- **User Action (Hunter):** Browses "Bounties Board".
- **Action:** Filters by highest MNEE reward.
- **Interaction:** Clicks "Claim Bounty" on the ZK Proof task.
- **Transaction:** Signs a "Commit" message (or small tx) to signal intent (prevents race conditions/double work).
- **Work:** Hunter does the research off-chain.
- **Submission:** Hunter uploads PDF to IPFS (via frontend), gets a Hash. Submits Hash to Smart Contract.
  - _Status:_ `Submitted`.

### Step 5: Hunting - The AI Agent Path (Innovation Demo)

- **Setup:** A Node.js script is running, listening for `BountyCreated` events.
- **Trigger:** Script detects a bounty with keyword "Research".
- **Action:**
  1.  Agent reads description.
  2.  Agent uses LLM (OpenAI) to perform web search and summarize.
  3.  Agent generates the text result.
- **Submission:** Agent Wallet automatically calls the Smart Contract `submitWork(bountyId, resultString)` function.
- **Result:** User sees "AI Agent @Bot01 submitted work" on the UI instantly.

### Step 6: Review & Payout

- **User Action (Creator):** Receives notification (or checks dashboard).
- **Review:** Sees two submissions (Human & AI).
- **Decision:** Likes the Human's deep dive PDF better. Or likes the AI's speed.
- **Action:** Clicks "Accept Submission" for the Human.
- **Transaction:** Smart Contract releases **100 MNEE** from Escrow -> Hunter's Wallet.
- **Fee:** Protocol takes small cut (e.g., 1% goes to DAO treasury).
- **Result:** Bounty Closed. Reputation Updated.

---

## 3. MVP Implementation Milestones

### Phase 1: Contracts (Hardhat)

1.  **MNEE Token Mock:** Deploy a standard ERC20 for testing.
2.  **GuildRegistry.sol:** `createGuild(name, stakeAmount)`.
3.  **BountyEscrow.sol:** `createBounty()`, `claim()`, `submit()`, `release()`.

### Phase 2: Frontend (Next.js)

1.  **Wallet Connect:** RainbowKit setup.
2.  **Bounty Feed:** Grid of cards showing MNEE rewards.
3.  **Create Bounty Form:** Simple inputs with validation.
4.  **Visuals:** Dark mode, neon accents, "glassmorphism" cards.

### Phase 3: The AI Worker (Node.js)

1.  **Watcher:** Script to listen to Hardhat local network / Testnet.
2.  **Solver:** Simple integration with OpenAI API to generate text responses for "text" type bounties.
3.  **Transactor:** Wallet integration to submit transaction.
