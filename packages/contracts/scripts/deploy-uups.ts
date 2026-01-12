import hre from "hardhat";
import {
  parseEther,
  formatEther,
  encodeFunctionData,
  getContractAddress,
  toHex,
} from "viem";

async function main() {
  const publicClient = await hre.viem.getPublicClient();
  const [deployer] = await hre.viem.getWalletClients();

  console.log(`Deploying contracts with account: ${deployer.account.address}`);

  // 1. Deploy MNEE (Mock)
  const mnee = await hre.viem.deployContract("MNEE", []);
  console.log(`MNEE deployed to: ${mnee.address}`);

  // 2. Deploy GuildRegistry Implementation
  const guildRegistryImpl = await hre.viem.deployContract("GuildRegistry", []);
  console.log(
    `GuildRegistry Implementation deployed to: ${guildRegistryImpl.address}`,
  );

  // 3. Deploy GuildRegistry Proxy
  // Encode initialize(address _mneeToken, address _admin)
  const guildRegistryInitData = encodeFunctionData({
    abi: guildRegistryImpl.abi,
    functionName: "initialize",
    args: [mnee.address, deployer.account.address],
  });

  const guildRegistryProxy = await hre.viem.deployContract("UUPSProxy", [
    guildRegistryImpl.address,
    guildRegistryInitData,
  ]);
  console.log(`GuildRegistry Proxy deployed to: ${guildRegistryProxy.address}`);

  // 4. Deploy BountyEscrow Implementation
  const bountyEscrowImpl = await hre.viem.deployContract("BountyEscrow", []);
  console.log(
    `BountyEscrow Implementation deployed to: ${bountyEscrowImpl.address}`,
  );

  // 5. Deploy BountyEscrow Proxy
  // Encode initialize(address _mneeToken, address _admin)
  const bountyEscrowInitData = encodeFunctionData({
    abi: bountyEscrowImpl.abi,
    functionName: "initialize",
    args: [mnee.address, deployer.account.address],
  });

  const bountyEscrowProxy = await hre.viem.deployContract("UUPSProxy", [
    bountyEscrowImpl.address,
    bountyEscrowInitData,
  ]);
  console.log(`BountyEscrow Proxy deployed to: ${bountyEscrowProxy.address}`);

  // 6. Deploy GuildGovernance Implementation
  const guildGovernanceImpl = await hre.viem.deployContract(
    "GuildGovernance",
    [],
  );
  console.log(
    `GuildGovernance Implementation deployed to: ${guildGovernanceImpl.address}`,
  );

  // 7. Deploy GuildGovernance Proxy
  const guildGovernanceInitData = encodeFunctionData({
    abi: guildGovernanceImpl.abi,
    functionName: "initialize",
    args: [
      guildRegistryProxy.address,
      bountyEscrowProxy.address,
      deployer.account.address,
    ],
  });

  const guildGovernanceProxy = await hre.viem.deployContract("UUPSProxy", [
    guildGovernanceImpl.address,
    guildGovernanceInitData,
  ]);
  console.log(
    `GuildGovernance Proxy deployed to: ${guildGovernanceProxy.address}`,
  );

  // Verification
  const guildRegistry = await hre.viem.getContractAt(
    "GuildRegistry",
    guildRegistryProxy.address,
  );

  console.log("----------------------------------------------------");
  console.log("Verifying roles...");
  const adminRole = await guildRegistry.read.DEFAULT_ADMIN_ROLE();
  const isAdmin = await guildRegistry.read.hasRole([
    adminRole,
    deployer.account.address,
  ]);
  console.log(`Deployer is GuildRegistry Admin: ${isAdmin}`);

  console.log("----------------------------------------------------");
  console.log("Deployment Complete!");
  console.log(`NEXT STEP: Update root '.env' with:`);
  console.log(`NEXT_PUBLIC_MNEE_ADDRESS="${mnee.address}"`);
  console.log(
    `NEXT_PUBLIC_GUILD_REGISTRY_ADDRESS="${guildRegistryProxy.address}"`,
  );
  console.log(
    `NEXT_PUBLIC_BOUNTY_ESCROW_ADDRESS="${bountyEscrowProxy.address}"`,
  );
  console.log(
    `NEXT_PUBLIC_GUILD_GOVERNANCE_ADDRESS="${guildGovernanceProxy.address}"`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
