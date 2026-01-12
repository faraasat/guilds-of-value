export const MNEE_ADDRESS = "0x0165878a594ca255338adfa4d48449f69242eb8f";
export const GUILD_REGISTRY_ADDRESS =
  "0x2279b7a0a67db372996a5fab50d91eaa73d2ebe6";
export const BOUNTY_ESCROW_ADDRESS =
  "0x610178da211fef7d417bc0e6fed39f05609ad788";
export const GUILD_GOVERNANCE_ADDRESS =
  "0xa51c1fc2f0d1a1b8494ed1fe312d7c3a78ed91c0";

export const MNEE_ABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const GUILD_REGISTRY_ABI = [
  {
    inputs: [{ internalType: "address", name: "_mneeToken", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "guildId",
        type: "uint256",
      },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      {
        indexed: true,
        internalType: "address",
        name: "master",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "stake",
        type: "uint256",
      },
    ],
    name: "GuildCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "guildId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "member",
        type: "address",
      },
    ],
    name: "MemberJoined",
    type: "event",
  },
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "uint256", name: "_stake", type: "uint256" },
      { internalType: "string", name: "_metadataURI", type: "string" },
    ],
    name: "createGuild",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_guildId", type: "uint256" }],
    name: "joinGuild",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_guildId", type: "uint256" }],
    name: "getGuild",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "address", name: "master", type: "address" },
          { internalType: "uint256", name: "stake", type: "uint256" },
          { internalType: "string", name: "metadataURI", type: "string" },
          { internalType: "bool", name: "exists", type: "bool" },
        ],
        internalType: "struct GuildRegistry.Guild",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextGuildId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const BOUNTY_ESCROW_ABI = [
  {
    inputs: [{ internalType: "address", name: "_mneeToken", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "BountyCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "hunter",
        type: "address",
      },
    ],
    name: "BountyClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "submissionURI",
        type: "string",
      },
    ],
    name: "WorkSubmitted",
    type: "event",
  },
  {
    inputs: [
      { internalType: "string", name: "_title", type: "string" },
      { internalType: "string", name: "_descriptionURI", type: "string" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "uint256", name: "_duration", type: "uint256" },
    ],
    name: "createBounty",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_bountyId", type: "uint256" }],
    name: "claimBounty",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_bountyId", type: "uint256" },
      { internalType: "string", name: "_submissionURI", type: "string" },
    ],
    name: "submitWork",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_bountyId", type: "uint256" }],
    name: "approveWork",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "bounties",
    outputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string", name: "descriptionURI", type: "string" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "address", name: "assignedHunter", type: "address" },
      { internalType: "string", name: "submissionURI", type: "string" },
      { internalType: "uint8", name: "status", type: "uint8" },
      { internalType: "uint256", name: "createdAt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextBountyId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const GUILD_GOVERNANCE_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "bountyId", type: "uint256" },
      { indexed: true, name: "guildId", type: "uint256" },
      { indexed: false, name: "support", type: "bool" },
    ],
    name: "VoteCast",
    type: "event",
  },
  {
    inputs: [{ name: "_bountyId", type: "uint256" }],
    name: "raiseDispute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "_bountyId", type: "uint256" },
      { name: "_support", type: "bool" },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
