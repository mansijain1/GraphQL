import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import path from "node:path";
import { gql } from "graphql-tag";
import { resolvers } from "./resolvers";
import { ListingAPI } from "./datasources/listing-api";

const typeDefs = gql(
  readFileSync(path.resolve(__dirname, "../src/schema.graphql"), {
    encoding: "utf-8",
  })
);

// console.log("Loaded schema:", typeDefs);

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers , introspection: true,});
  const { url } = await startStandaloneServer(server, {
    context: async () => {
      const { cache } = server;
      return {
        dataSources: {
          listingAPI: new ListingAPI({ cache }),
        },
      };
    },
  });
  
  console.log(`Server is running! Query at ${url}`);
}

startApolloServer();