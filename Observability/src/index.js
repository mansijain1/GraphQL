import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./server/typeDefs.js";
import {resolvers } from "./server/resolvers.js"
import { performance } from "node:perf_hooks";
import { ApolloServerPluginUsageReporting } from "@apollo/server/plugin/usageReporting";
import '../otel.js';
import { ApolloServerPluginInlineTraceDisabled } from "@apollo/server/plugin/disabled";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
   includeStacktraceInErrors: true,
  plugins: [
  {
    async requestDidStart(requestContext) {
      const startTime = performance.now();

      return {
        async willSendResponse({ response, request }) {
          const endTime = performance.now();
          const duration = endTime - startTime;

          // Skip introspection queries (they always include "__schema" or "__type")
          if (request.query && request.query.includes("__schema")) return;

          const operationName = request.operationName || "UnnamedOperation";

          // Extract client headers
          const clientHeader =
            request.http?.headers.get("apollographql-client-name") ||
            request.http?.headers.get("user-agent") ||
            "Unknown Client";

          console.log("\n=== GraphQL Query Tracing ===");
          console.log("Operation:", operationName);
          console.log("Client:", clientHeader);
          console.log("Query:", request.query?.trim() || "N/A");
          console.log("Duration (ms):", duration.toFixed(2));
          if (response.data) {
            console.log("Response keys:", Object.keys(response.data));
          }
          console.log("============================\n");
        },
      };
    },
  },
  //  ApolloServerPluginUsageReporting({
  //     // optional: provide a key, otherwise reads from env APOLLO_KEY
  //     // If you don't have APOLLO_KEY, create one at studio.apollographql.com
  //     sendReportsImmediately: true, 
  //   }),
],

});

const PORT = 4000;

const { url } = await startStandaloneServer(server, { listen: { port: PORT } });

console.log(`Server ready at ${url}`);
