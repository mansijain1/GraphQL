import { createClient } from 'graphql-ws';
import WebSocket from 'ws';
import readline from 'node:readline';

const GRAPHQL_WS_URL = 'ws://localhost:4000/graphql';
const GRAPHQL_HTTP_URL = 'http://localhost:4000/graphql';

const SUBSCRIPTION = `
  subscription {
    messageAdded {
      id
      content
    }
  }
`;

const MUTATION = `
  mutation($content: String!) {
    postMessage(content: $content) {
      id
      content
    }
  }
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt() {
  rl.prompt(true);
}

// Function to send message mutation
async function postMessage(content) {
  const res = await fetch(GRAPHQL_HTTP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: MUTATION,
      variables: { content },
    }),
  });
  const json = await res.json();
  return json.data.postMessage;
}

// Subscription client
const client = createClient({
  url: GRAPHQL_WS_URL,
  webSocketImpl: WebSocket,
});

console.log('Connecting to GraphQL subscription server...');

rl.setPrompt('Type a message: ');
rl.prompt();

client.subscribe(
  { query: SUBSCRIPTION },
  {
    next: ({ data }) => {
      const msg = data.messageAdded;
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      console.log(`${msg.content}`);
      rl.prompt(true);
    },
    error: (err) => console.error('Subscription error:', err),
    complete: () => console.log('Subscription complete'),
  }
);

// Handle terminal input
rl.on('line', async (line) => {
  const content = line.trim();
  if (!content) return rl.prompt();
  if (content.toLowerCase() === 'exit') {
    console.log('Goodbye!');
    process.exit(0);
  }

  try {
    const msg = await postMessage(content);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(`Sent: ${msg.content}`);
  } catch (err) {
    console.error('Error sending message:', err);
  }

  rl.prompt();
});
