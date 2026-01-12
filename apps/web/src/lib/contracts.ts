export const MNEE_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
export const GUILD_REGISTRY_ADDRESS =
  "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
export const BOUNTY_ESCROW_ADDRESS =
  "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0";

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
