import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema/typeDefs.js";
import { resolvers } from "./schema/resolvers.js";
import { getUserFromToken } from "./utils/auth.js";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { authDirectives } from "./directives/authDirectives.js";
import depthLimit from "graphql-depth-limit";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloServerPluginInlineTraceDisabled } from "@apollo/server/plugin/disabled";
import { createUserLoader } from "./loaders/userLoader.js";
import ApolloServerPluginResponseCache from '@apollo/server-plugin-response-cache';
import { costLimitRule } from "@escape.tech/graphql-armor-cost-limit";

export const startServer = async () => {
  try {
  const PORT = process.env.PORT || 4000;

  const schema= buildSubgraphSchema({typeDefs, resolvers });
  const securedSchema = authDirectives(schema);

  // Define your whitelist
  const ALLOWED_OPERATIONS = new Set([
    "query me { me { id username role } }",
    "query users { users { id username role } }",
    "mutation login($username: String!, $password: String!) { login(username: $username, password: $password) }",
    "query { user1: userById(id: 1) { id username } user2: userById(id: 2) { id username } }"
  ]);

  const server = new ApolloServer({
    schema: securedSchema,
    introspection: true,
      plugins: [
      // Query Whitelisting Plugin
        {
          async requestDidStart() {
            return {
              async didResolveOperation({ request }) {
                if (!ALLOWED_OPERATIONS.has(request.query.trim())) {
                  throw new Error("Query not whitelisted");
                }
              },
            };
          },
        },
        ApolloServerPluginResponseCache(),
        ApolloServerPluginInlineTraceDisabled(),
        ApolloServerPluginLandingPageLocalDefault(),
      ],
    validationRules: [
      depthLimit(5), // limit query nesting depth to 5
      costLimitRule({
        maxCost: 1000,        // Maximum total cost
        objectCost: 2,        // Cost per object field
        scalarCost: 1,        // Cost per scalar field
        depthCostFactor: 1.5, // Multiplier for nested fields
        ignoreIntrospection: true, // Don’t count __schema or __type queries
      }),
    ],
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
    context: async ({ req }) => {
      // Create a timeout promise
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Query timeout")), 3000)
      );
    // Actual context builder
    const buildContext = async () => {
      const token = req.headers.authorization?.replace("Bearer ", "") || "";
      const user = getUserFromToken(token);

      return {
        user,
        loaders: {
          userLoader: createUserLoader(),
        },
      };
    };
    // Race between the real context and timeout
    return Promise.race([buildContext(), timeout]);
    },
  });
  console.log(`Server ready at ${url}`);
} catch (err) {
  console.error("Server failed to start:", err);
}
};
