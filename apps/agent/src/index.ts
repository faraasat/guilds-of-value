import dotenv from "dotenv";
import {
  createPublicClient,
  createWalletClient,
  http,
  parseAbiItem,
  PublicClient,
  WalletClient,
  getContract,
  Address,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet, localhost } from "viem/chains";

dotenv.config();

const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.AGENT_PRIVATE_KEY as `0x${string}`;
const BOUNTY_ESCROW_ADDRESS = process.env.BOUNTY_ESCROW_ADDRESS as Address;

const BOUNTY_ESCROW_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "bountyId", type: "uint256" },
      { indexed: true, name: "creator", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    name: "BountyCreated",
    type: "event",
  },
  {
    inputs: [{ name: "_bountyId", type: "uint256" }],
    name: "claimBounty",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "_bountyId", type: "uint256" },
      { name: "_submissionURI", type: "string" },
    ],
    name: "submitWork",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

async function runAgent() {
  console.log("AI Agent Service Starting...");
  console.log(`Watching Escrow at: ${BOUNTY_ESCROW_ADDRESS}`);

  const account = privateKeyToAccount(PRIVATE_KEY);
  const publicClient = createPublicClient({
    chain: localhost,
    transport: http(RPC_URL),
  });

  const walletClient = createWalletClient({
    account,
    chain: localhost,
    transport: http(RPC_URL),
  });

  const contract = getContract({
    address: BOUNTY_ESCROW_ADDRESS,
    abi: BOUNTY_ESCROW_ABI,
    client: { public: publicClient, wallet: walletClient },
  });

  console.log(`Agent initialized with address: ${account.address}`);

  // Watch for BountyCreated events
  publicClient.watchEvent({
    address: BOUNTY_ESCROW_ADDRESS,
    event: parseAbiItem(
      "event BountyCreated(uint256 indexed bountyId, address indexed creator, uint256 amount)",
    ),
    onLogs: async (logs) => {
      for (const log of logs) {
        const { bountyId, creator, amount } = log.args;
        console.log(
          `\n[NEW BOUNTY] ID: ${bountyId}, Creator: ${creator}, Reward: ${amount}`,
        );

        if (creator?.toLowerCase() === account.address.toLowerCase()) {
          console.log("Skipping own bounty.");
          continue;
        }

        try {
          console.log(`Claiming bounty ${bountyId}...`);
          const claimTx = await contract.write.claimBounty([bountyId!]);
          console.log(`Claimed! TX: ${claimTx}`);

          // Simulate AI Work
          console.log("Generating AI solution...");
          await new Promise((r) => setTimeout(r, 2000)); // Simulate delay

          const submission = `AI AGENT SOLUTION: This is an automated response for bounty #${bountyId}. The task has been processed and verified by the Guilds of Value AI Network. [Timestamp: ${new Date().toISOString()}]`;

          console.log(`Submitting work for bounty ${bountyId}...`);
          const submitTx = await contract.write.submitWork([
            bountyId!,
            submission,
          ]);
          console.log(`Work submitted! TX: ${submitTx}`);
          console.log(`-----------------------------------------`);
        } catch (error) {
          console.error(`Failed to process bounty ${bountyId}:`, error);
        }
      }
    },
  });

  console.log("Waiting for new bounties...");
}

runAgent().catch(console.error);
