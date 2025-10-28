import fetch from 'node-fetch';

const GRAPHQL_URL = 'http://localhost:8000/graphql';

const query = `
query {
  products {
    id
    name
    ...commentsFragment @defer
    relatedProducts @stream(initialCount: 1) {
      id
      name
      ...relatedCommentsFragment @defer
    }
  }
}

fragment commentsFragment on Product {
  comments
}

fragment relatedCommentsFragment on Product {
  comments
}
`;

async function fetchStreamedGraphQL() {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'multipart/mixed',
    },
    body: JSON.stringify({ query }),
  });

  if (!res.body) {
    console.error('No response body from server');
    return;
  }

  res.body.setEncoding('utf8');

  let buffer = '';

  res.body.on('data', (chunk) => {
    buffer += chunk;

    // Each part starts with a boundary -- and ends before the next --
    const parts = buffer.split(/\r?\n--/).filter(Boolean);
    buffer = parts.pop() || ''; // keep incomplete part

    parts.forEach((part) => {
      // Extract the JSON payload (skip headers)
      const jsonMatch = part.match(/\r?\n\r?\n({[\s\S]*})/);
      if (jsonMatch) {
        try {
          const data = JSON.parse(jsonMatch[1]);
          console.log('Received chunk:');
          console.log(JSON.stringify(data, null, 2));
        } catch (err) {
          console.error('Failed to parse chunk JSON:', err);
        }
      }
    });
  });

  res.body.on('end', () => {
    console.log('Stream ended');

    // Try to parse any remaining JSON in the last buffer
    const remainingParts = buffer.split(/\r?\n--/).filter(Boolean);
    remainingParts.forEach((part) => {
      const jsonMatch = part.match(/\r?\n\r?\n({[\s\S]*})/);
      if (jsonMatch) {
        try {
          const data = JSON.parse(jsonMatch[1]);
          console.log('Final chunk:');
          console.log(JSON.stringify(data, null, 2));
        } catch (err) {
          // Silently ignore if not valid JSON (leftover headers)
        }
      }
    });
  });
}

fetchStreamedGraphQL();
