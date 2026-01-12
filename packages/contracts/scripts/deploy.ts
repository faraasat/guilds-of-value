import { formatEther, parseEther } from "viem";
import hre from "hardhat";

async function main() {
  const [deployer] = await hre.viem.getWalletClients();
  const publicClient = await hre.viem.getPublicClient();

  console.log(
    `Deploying contracts with the account: ${deployer.account.address}`,
  );

  // 1. Deploy MNEE
  const mnee = await hre.viem.deployContract("MNEE", []);
  console.log(`MNEE deployed to ${mnee.address}`);

  // 2. Deploy GuildRegistry
  const guildRegistry = await hre.viem.deployContract("GuildRegistry", [
    mnee.address,
  ]);
  console.log(`GuildRegistry deployed to ${guildRegistry.address}`);

  // 3. Deploy BountyEscrow
  const bountyEscrow = await hre.viem.deployContract("BountyEscrow", [
    mnee.address,
  ]);
  console.log(`BountyEscrow deployed to ${bountyEscrow.address}`);

  // Verify
  const balance = await mnee.read.balanceOf([deployer.account.address]);
  console.log(`Deployer MNEE Balance: ${formatEther(balance)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
