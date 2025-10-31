import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./server/typeDefs.js";
import {resolvers } from "./server/resolvers.js"
import { performance } from "node:perf_hooks";
import { ApolloServerPluginUsageReporting } from "@apollo/server/plugin/usageReporting";
import '../otel.js';
import { ApolloServerPluginInlineTraceDisabled } from "@apollo/server/plugin/disabled";
import ApolloServerPluginResponseCache from '@apollo/server-plugin-response-cache';
import 'dotenv/config';
import { costLimitRule } from "@escape.tech/graphql-armor-cost-limit";
import depthLimit from "graphql-depth-limit";
import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache";
import { createBookLoader } from './loaders/bookLoader.js';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  includeStacktraceInErrors: true,
  cache: new InMemoryLRUCache(),
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
    ...(process.env.APOLLO_KEY && process.env.APOLLO_GRAPH_REF
      ? [ApolloServerPluginUsageReporting({ sendReportsImmediately: true })]
      : []),
    ApolloServerPluginInlineTraceDisabled(),
    ApolloServerPluginResponseCache({
      sessionId: (requestContext) => {
        // identify session by an auth header or user id
        const authHeader = requestContext.request.http.headers.get('authorization');
        return authHeader || null; // return null to disable caching for unknown users
      },
    }),
    ApolloServerPluginCacheControl({ defaultMaxAge: 10 , // 10 seconds
      calculateHttpHeaders: true, // optional, sets `cache-control` headers
    }) 
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

const PORT = 4000;

const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
  context: async () => {
    return {  
      bookLoader: createBookLoader(),
    };
  },
 });

console.log(`Server ready at ${url}`);
