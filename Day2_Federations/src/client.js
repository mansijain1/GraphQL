import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';
import fetch from 'cross-fetch';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000',
    fetch,
  }),
  cache: new InMemoryCache(),
});

const queries = {
  getUsers: gql`
    query {
      users {
        id
        name
      }
    }
  `,
  getUserById: gql`
    query GetUserById($userId: ID!) {
      user(id: $userId) {
        id
        name
        posts {
          id
          title
        }
      }
    }
  `,
  getPostsWithAuthor: gql`
    query {
      posts {
        id
        title
        author {
          id
          name
        }
      }
    }
  `,
};

async function runQuery(name, variables = {}) {
  try {
    const result = await client.query({
      query: queries[name],
      variables,
    });
    console.log(`${name} result:`);
    console.log(JSON.stringify(result.data, null, 2));
  } catch (error) {
    console.error(`Error running ${name}:`, error);
  }
}

async function promptUser() {
  while (true) {
    console.log("\nChoose a query to run:");
    console.log("1: Get all users");
    console.log("2: Get user by ID");
    console.log("3: Get posts with authors");
    console.log("Type 'exit' or 'q' to quit.");

    const answer = await rl.question("Enter the number of your choice: ");
    const trimmed = answer.trim().toLowerCase();

    if (trimmed === 'exit' || trimmed === 'q') {
      console.log("Exiting...");
      rl.close();
      break;
    }

    switch (trimmed) {
      case '1':
        await runQuery('getUsers');
        break;
      case '2': {
        const id = await rl.question("Enter user ID: ");
        await runQuery('getUserById', { userId: id });
        break;
      }
      case '3':
        await runQuery('getPostsWithAuthor');
        break;
      default:
        console.log("Invalid choice, please try again.");
    }
  }
}

promptUser();
