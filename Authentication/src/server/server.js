import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema/typeDefs.js";
import { resolvers } from "./schema/resolvers.js";
import { getUserFromToken } from "./utils/auth.js";
import { buildSubgraphSchema } from "@apollo/subgraph";

export const startServer = async () => {
  const PORT = process.env.PORT || 4000;

  const server = new ApolloServer({
    schema: buildSubgraphSchema( {
    typeDefs,
    resolvers,
    }),
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
    context: async ({ req }) => {
      const token = req.headers.authorization?.replace("Bearer ", "") || "";
      const user = getUserFromToken(token);
      // const scopes = user ? [user.role] : [];

      // return { user, scopes };
      return {user};
    },
  });

  console.log(`🚀 Server ready at ${url}`);
};
