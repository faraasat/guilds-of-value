import dotenv from "dotenv";
import path from "path";
import {
  createPublicClient,
  createWalletClient,
  http,
  parseAbiItem,
  getContract,
  Address,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { localhost } from "viem/chains";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";

// Load from Root .env
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.AGENT_PRIVATE_KEY as `0x${string}`;
const BOUNTY_ESCROW_ADDRESS = process.env
  .NEXT_PUBLIC_BOUNTY_ESCROW_ADDRESS as Address;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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
  {
    inputs: [{ name: "_bountyId", type: "uint256" }],
    name: "bounties",
    outputs: [
      { name: "id", type: "uint256" },
      { name: "creator", type: "address" },
      { name: "title", type: "string" },
      { name: "descriptionURI", type: "string" },
      { name: "amount", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "assignedHunter", type: "address" },
      { name: "submissionURI", type: "string" },
      { name: "status", type: "uint8" },
      { name: "createdAt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

async function runAgent() {
  console.log("-----------------------------------------");
  console.log("🚀 PRODUCTION AI AGENT STARTING...");
  console.log(`Watching Escrow at: ${BOUNTY_ESCROW_ADDRESS}`);

  if (!GEMINI_API_KEY) {
    console.warn("⚠️  GEMINI_API_KEY missing. Falling back to Mock responses.");
  }

  // 1. Initialize Storage (Helia)
  const helia = await createHelia();
  const fs = unixfs(helia);
  console.log("📦 IPFS (Helia) Initialized.");

  // 2. Initialize AI (Gemini)
  const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
  const model = genAI?.getGenerativeModel({ model: "gemini-1.5-flash" });

  // 3. Initialize Blockchain
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

  console.log(`🤖 Agent Identity: ${account.address}`);
  console.log("-----------------------------------------");

  publicClient.watchEvent({
    address: BOUNTY_ESCROW_ADDRESS,
    event: parseAbiItem(
      "event BountyCreated(uint256 indexed bountyId, address indexed creator, uint256 amount)",
    ),
    onLogs: async (logs) => {
      for (const log of logs) {
        const { bountyId } = log.args;

        // Fetch full bounty details
        const bountyData = await contract.read.bounties([bountyId!]);
        const [id, creator, title, descriptionURI] = bountyData as any;

        console.log(`\n[NEW BOUNTY detected] #${id}: ${title}`);

        if (creator.toLowerCase() === account.address.toLowerCase()) continue;

        try {
          // Step 1: Claim
          console.log("  -> Claiming bounty...");
          await contract.write.claimBounty([bountyId!]);

          // Step 2: Resolve Description (IPFS or Literal)
          let description = descriptionURI;
          if (descriptionURI.startsWith("ipfs://")) {
            const cid = descriptionURI.replace("ipfs://", "");
            console.log(`  -> Fetching payload from IPFS (CID: ${cid})...`);
            const chunks = [];
            for await (const chunk of fs.cat(cid as any)) {
              chunks.push(chunk);
            }
            description = new TextDecoder().decode(Buffer.concat(chunks));
          }

          // Step 3: Generate Solution (Gemini)
          console.log("  -> Consulting Gemini AI...");
          let resultText = "";
          if (model) {
            const prompt = `You are a professional bounty hunter in the "Guilds of Value" network. 
                        Task Title: ${title}
                        Task Description: ${description}
                        
                        Please provide a comprehensive, technical, and verifiable solution or response to this task.
                        Format it professionally.`;

            const result = await model.generateContent(prompt);
            resultText = result.response.text();
          } else {
            resultText = "[MOCK] AI solution for: " + description;
          }

          // Step 4: Upload Result to IPFS
          console.log("  -> Uploading solution to IPFS...");
          const content = new TextEncoder().encode(resultText);
          const cid = await fs.addBytes(content);
          const submissionURI = `ipfs://${cid}`;
          console.log(`  -> Solution verifiable at: ${submissionURI}`);

          // Step 5: Submit Work
          console.log("  -> Submitting work to blockchain...");
          await contract.write.submitWork([bountyId!, submissionURI]);
          console.log(`✅ Bounty #${id} processed!`);
        } catch (error) {
          console.error(`❌ Error processing bounty #${bountyId}:`, error);
        }
      }
    },
  });

  console.log("📡 Listening for orbital signals (Bounty Events)...");
}

runAgent().catch(console.error);
