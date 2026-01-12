import { ponder } from "@/generated";
import { bounty, guild, member, dispute, vote } from "../ponder.schema";

ponder.on("GuildRegistry:GuildCreated", async ({ event, context }: any) => {
  await context.db.insert(guild).values({
    id: event.args.guildId,
    name: event.args.name,
    master: event.args.master,
    totalStake: event.args.stake,
    descriptionURI: "", // Add if available in future events
    createdAt: event.block.timestamp,
  });
});

ponder.on("GuildRegistry:MemberJoined", async ({ event, context }: any) => {
  await context.db.insert(member).values({
    address: event.args.member,
    guildId: event.args.guildId,
    joinedAt: event.block.timestamp,
  });
});

ponder.on("BountyEscrow:BountyCreated", async ({ event, context }: any) => {
  await context.db.insert(bounty).values({
    id: event.args.bountyId,
    creator: event.args.creator,
    title: "", // Title usually comes from description URI but let's see
    descriptionURI: "",
    amount: event.args.amount,
    status: 0,
    createdAt: event.block.timestamp,
  });
});

ponder.on("BountyEscrow:BountyClaimed", async ({ event, context }: any) => {
  await context.db.update(bounty, { id: event.args.bountyId }).set({
    hunter: event.args.hunter,
    status: 1,
  });
});

ponder.on("BountyEscrow:WorkSubmitted", async ({ event, context }: any) => {
  await context.db.update(bounty, { id: event.args.bountyId }).set({
    submissionURI: event.args.submissionURI,
    status: 2,
  });
});

ponder.on("GuildGovernance:DisputeRaised", async ({ event, context }: any) => {
  await context.db.insert(dispute).values({
    id: event.args.bountyId,
    raiser: event.args.raiser,
    votesFor: 0n,
    votesAgainst: 0n,
    resolved: false,
    createdAt: event.block.timestamp,
  });
});

ponder.on("GuildGovernance:VoteCast", async ({ event, context }: any) => {
  await context.db.insert(vote).values({
    id: `${event.args.bountyId}-${event.args.guildId}`,
    bountyId: event.args.bountyId,
    guildId: event.args.guildId,
    support: event.args.support,
    votedAt: event.block.timestamp,
  });

  const d = await context.db.find(dispute, { id: event.args.bountyId });
  if (d) {
    await context.db.update(dispute, { id: event.args.bountyId }).set({
      votesFor: event.args.support ? d.votesFor + 1n : d.votesFor,
      votesAgainst: event.args.support ? d.votesAgainst : d.votesAgainst + 1n,
    });
  }
});

ponder.on(
  "GuildGovernance:DisputeResolved",
  async ({ event, context }: any) => {
    await context.db.update(dispute, { id: event.args.bountyId }).set({
      resolved: true,
    });
  },
);
