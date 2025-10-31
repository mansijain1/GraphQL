import { NodeSDK } from "@opentelemetry/sdk-node";
import { GraphQLInstrumentation } from "@opentelemetry/instrumentation-graphql";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

const traceExporter = new OTLPTraceExporter({
  url: "http://localhost:4318/v1/traces",
});

const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [
    new GraphQLInstrumentation({ mergeItems: true }),
    getNodeAutoInstrumentations(),
  ],
});

await sdk.start();
console.log("OpenTelemetry tracing started");
