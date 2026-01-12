import { request, gql } from "graphql-request";

const INDEXER_URL = "http://localhost:42069"; // Ponder default

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    guilds(limit: 5, orderBy: "createdAt", orderDirection: "desc") {
      id
      name
      master
      totalStake
    }
    bounties(limit: 5, orderBy: "createdAt", orderDirection: "desc") {
      id
      title
      amount
      status
    }
  }
`;

export const GET_BOUNTIES = gql`
  query GetBounties {
    bounties(orderBy: "createdAt", orderDirection: "desc") {
      id
      creator
      title
      descriptionURI
      amount
      status
      hunter
      submissionURI
      createdAt
    }
  }
`;

export const GET_GUILDS = gql`
  query GetGuilds {
    guilds(orderBy: "createdAt", orderDirection: "desc") {
      id
      name
      master
      totalStake
      createdAt
    }
  }
`;

export const GET_DISPUTES = gql`
  query GetDisputes {
    disputes(orderBy: "createdAt", orderDirection: "desc") {
      id
      raiser
      votesFor
      votesAgainst
      resolved
      createdAt
    }
  }
`;

export async function fetchIndexer(query: string, variables = {}) {
  try {
    return await request(INDEXER_URL, query, variables);
  } catch (error) {
    console.error("Indexer fetch error:", error);
    return null;
  }
}
