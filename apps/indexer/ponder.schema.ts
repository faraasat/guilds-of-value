import { onchainTable } from "@ponder/core";

export const guild = onchainTable("guild", (p) => ({
  id: p.bigint().primaryKey(),
  name: p.text(),
  master: p.hex(),
  descriptionURI: p.text(),
  totalStake: p.bigint(),
  createdAt: p.bigint(),
}));

export const bounty = onchainTable("bounty", (p) => ({
  id: p.bigint().primaryKey(),
  creator: p.hex(),
  title: p.text(),
  descriptionURI: p.text(),
  amount: p.bigint(),
  status: p.integer(), // 0: Open, 1: Claimed, 2: Submitted, 3: Completed, 4: Voided
  hunter: p.hex(),
  submissionURI: p.text(),
  createdAt: p.bigint().notNull(),
}));

export const member = onchainTable("member", (p) => ({
  address: p.hex().primaryKey(),
  guildId: p.bigint(),
  joinedAt: p.bigint(),
}));

export const dispute = onchainTable("dispute", (p) => ({
  id: p.bigint().primaryKey(), // bountyId
  raiser: p.hex(),
  votesFor: p.bigint().notNull(),
  votesAgainst: p.bigint().notNull(),
  resolved: p.boolean().notNull(),
  createdAt: p.bigint().notNull(),
}));

export const vote = onchainTable("vote", (p) => ({
  id: p.text().primaryKey(), // bountyId + guildId
  bountyId: p.bigint(),
  guildId: p.bigint(),
  support: p.boolean(),
  votedAt: p.bigint().notNull(),
}));
