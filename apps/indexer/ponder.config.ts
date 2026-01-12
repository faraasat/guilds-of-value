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
      address: "0x2279b7a0a67db372996a5fab50d91eaa73d2ebe6",
      startBlock: 0,
    },
    BountyEscrow: {
      network: "localhost",
      abi: BOUNTY_ESCROW_ABI,
      address: "0x610178da211fef7d417bc0e6fed39f05609ad788",
      startBlock: 0,
    },
    GuildGovernance: {
      network: "localhost",
      abi: GUILD_GOVERNANCE_ABI,
      address: "0xa51c1fc2f0d1a1b8494ed1fe312d7c3a78ed91c0",
      startBlock: 0,
    },
  },
});
