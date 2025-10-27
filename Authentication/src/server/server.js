import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema/typeDefs.js";
import { resolvers } from "./schema/resolvers.js";
import { getUserFromToken } from "./utils/auth.js";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { authDirectives } from "./directives/authDirectives.js";

export const startServer = async () => {
  const PORT = process.env.PORT || 4000;

const schema= buildSubgraphSchema({typeDefs, resolvers });
  const securedSchema = authDirectives(schema);

 const server = new ApolloServer({
    schema: securedSchema,
 });
  
  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
    context: async ({ req }) => {
      const token = req.headers.authorization?.replace("Bearer ", "") || "";
      const user = getUserFromToken(token);

      return {user};
    },
  });

  console.log(`🚀 Server ready at ${url}`);
};
