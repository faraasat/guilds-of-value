import hre from "hardhat";
import { parseEther } from "viem";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

async function main() {
  const [deployer, user1, user2, user3] = await hre.viem.getWalletClients();
  const publicClient = await hre.viem.getPublicClient();

  const MNEE_ADDRESS = process.env.NEXT_PUBLIC_MNEE_ADDRESS;
  const REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_GUILD_REGISTRY_ADDRESS;
  const ESCROW_ADDRESS = process.env.NEXT_PUBLIC_BOUNTY_ESCROW_ADDRESS;

  if (!MNEE_ADDRESS || !REGISTRY_ADDRESS || !ESCROW_ADDRESS) {
    throw new Error("Missing environment variables.");
  }

  console.log("🌱 Seeding Ecosystem...");
  console.log(`Addresses: MNEE=${MNEE_ADDRESS}, REGISTRY=${REGISTRY_ADDRESS}`);

  const mnee = (await hre.viem.getContractAt("MNEE", MNEE_ADDRESS)) as any;
  const registry = (await hre.viem.getContractAt(
    "GuildRegistry",
    REGISTRY_ADDRESS,
  )) as any;
  const escrow = (await hre.viem.getContractAt(
    "BountyEscrow",
    ESCROW_ADDRESS,
  )) as any;

  // 1. Fund Users
  console.log("💸 Funding Users...");
  await mnee.write.mint([user1.account.address, parseEther("5000")]);
  await mnee.write.mint([user2.account.address, parseEther("5000")]);
  await mnee.write.mint([user3.account.address, parseEther("5000")]);

  // 2. Create Guilds
  console.log("🏰 Creating Guilds...");

  // Guild 1: Cyber Ronin (User 1)
  await mnee.write.approve([REGISTRY_ADDRESS, parseEther("1000")], {
    account: user1.account,
  });
  await registry.write.createGuild(
    ["Cyber Ronin", parseEther("500"), "ipfs://QmCyberRonin"],
    { account: user1.account },
  );

  // Guild 2: Neon Syndicate (User 2)
  await mnee.write.approve([REGISTRY_ADDRESS, parseEther("1000")], {
    account: user2.account,
  });
  await registry.write.createGuild(
    ["Neon Syndicate", parseEther("500"), "ipfs://QmNeonSyndicate"],
    { account: user2.account },
  );

  // Guild 3: Data Miners (User 3)
  await mnee.write.approve([REGISTRY_ADDRESS, parseEther("1000")], {
    account: user3.account,
  });
  await registry.write.createGuild(
    ["Data Miners", parseEther("500"), "ipfs://QmDataMiners"],
    { account: user3.account },
  );

  // 3. Create Bounties
  console.log("📜 Posting Bounties...");

  // Bounty 1: Open
  await mnee.write.approve([ESCROW_ADDRESS, parseEther("1000")], {
    account: user1.account,
  });
  await escrow.write.createBounty(
    [
      "Recover Flight Recorder",
      "ipfs://QmFlightRec",
      parseEther("200"),
      86400n,
    ],
    { account: user1.account },
  );

  // Bounty 2: Active (Claimed by User 2)
  await mnee.write.approve([ESCROW_ADDRESS, parseEther("1000")], {
    account: user3.account,
  });
  const tx = await escrow.write.createBounty(
    ["Secure Outpost Alpha", "ipfs://QmOutpost", parseEther("450"), 86400n],
    { account: user3.account },
  );

  // Wait for it to be indexable/claimable. Ideally we get ID, but hardcoding expectation of ID 2
  // We can just claim check last ID.
  const count = await escrow.read.nextBountyId();
  const bountyId = count - 1n; // Last one

  await escrow.write.claimBounty([bountyId], { account: user2.account });

  console.log("✅ Seeding Complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
