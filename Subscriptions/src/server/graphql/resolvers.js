import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();
const MESSAGE_ADDED = 'MESSAGE_ADDED';
const messages = [];

export const resolvers = {
  Query: { messages: () => messages },
  Mutation: {
    postMessage: (_, { content }) => {
      const message = { id: Date.now(), content };
      messages.push(message);
      pubsub.publish('MESSAGE_ADDED', { messageAdded: message });
      return message;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator(['MESSAGE_ADDED']),
    },
  },
};