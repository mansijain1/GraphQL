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

// docker run -d --name jaeger \
//   -e COLLECTOR_ZIPKIN_HTTP_PORT=9411 \
//   -p 16686:16686 \
//   -p 14268:14268 \
//   -p 14250:14250 \
//   jaegertracing/all-in-one:1.43