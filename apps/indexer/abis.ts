export const GUILD_REGISTRY_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "guildId", type: "uint256" },
      { indexed: false, name: "name", type: "string" },
      { indexed: true, name: "master", type: "address" },
      { indexed: false, name: "stake", type: "uint256" },
    ],
    name: "GuildCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "guildId", type: "uint256" },
      { indexed: true, name: "member", type: "address" },
    ],
    name: "MemberJoined",
    type: "event",
  },
] as const;

export const BOUNTY_ESCROW_ABI = [
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
    anonymous: false,
    inputs: [
      { indexed: true, name: "bountyId", type: "uint256" },
      { indexed: true, name: "hunter", type: "address" },
    ],
    name: "BountyClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "bountyId", type: "uint256" },
      { indexed: false, name: "submissionURI", type: "string" },
    ],
    name: "WorkSubmitted",
    type: "event",
  },
] as const;

export const GUILD_GOVERNANCE_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "bountyId", type: "uint256" },
      { indexed: true, name: "raiser", type: "address" },
    ],
    name: "DisputeRaised",
    type: "event",
  },
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
    anonymous: false,
    inputs: [
      { indexed: true, name: "bountyId", type: "uint256" },
      { indexed: false, name: "support", type: "bool" },
    ],
    name: "DisputeResolved",
    type: "event",
  },
] as const;
