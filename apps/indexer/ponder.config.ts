import { createConfig } from "@ponder/core";
import { http } from "viem";

import {
  GUILD_REGISTRY_ABI,
  BOUNTY_ESCROW_ABI,
  GUILD_GOVERNANCE_ABI,
} from "./abis";

export default createConfig({
  networks: {
    localhost: {
      chainId: 31337,
      transport: http("http://127.0.0.1:8545"),
    },
  },
  contracts: {
    GuildRegistry: {
      network: "localhost",
      abi: GUILD_REGISTRY_ABI,
      address: "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9",
      startBlock: 0,
    },
    BountyEscrow: {
      network: "localhost",
      abi: BOUNTY_ESCROW_ABI,
      address: "0x5fc8d32690cc91d4c39d9d3abcbd16989f875707",
      startBlock: 0,
    },
    GuildGovernance: {
      network: "localhost",
      abi: GUILD_GOVERNANCE_ABI,
      address: "0xa513e6e4b8f2a923d98304ec87f64353c4d5c853",
      startBlock: 0,
    },
  },
});
