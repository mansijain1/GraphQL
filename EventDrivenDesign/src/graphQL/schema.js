const { gql } = require('graphql-tag');
const { produce } = require('../kafka/producer');
const { addUser, getUser, getAllUsers , updateUser, deleteUser} = require('./readModel');

const topic = process.env.KAFKA_TOPIC;

const typeDefs = gql`
  type User {
    id: ID!
    name: String
  }

  type UserEvent {
    type: String!
    data: User
  }

  type UserAnalytics {
    window_start: String
    window_end: String
    created_count: Int
  }

  type Subscription {
    userEvents: UserEvent!
    userAnalytics: UserAnalytics!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(name: String!): User!
    deleteUser(id: ID!): User!
    updateUser(id: ID!, name: String!): User!
  }
`;

const resolvers = {
  Query: {
    users: () => getAllUsers(),
    user: (_, { id }) => getUser(Number(id)),
  },
  Mutation: {
    createUser: async (_, { name }) => {
      const user = { id: Date.now(), name };
      const event = { type: 'USER_CREATED', data: user };
      await produce(topic, event);
      // Update read model immediately for synchronous response
      addUser(user);
      return user;
    },
    deleteUser: async (_, { id }) => {
      const user = getUser(Number(id));
      if (!user) throw new Error('User not found');
     
      const event = { type: 'USER_DELETED', data: { id: Number(id) } };
      await produce(topic, event);

      // update read model immediately
      return deleteUser(Number(id));
    },
    updateUser: async (_, { id, name }) => {
      const existingUser = getUser(Number(id));
      if (!existingUser) throw new Error('User not found');

      const updatedUser = { ...existingUser, name };
      const event = { type: 'USER_UPDATED', data: { newUser: updatedUser } };

      await produce(topic, event);
       // update read model immediately for synchronous response
      return updateUser(Number(id), updatedUser);
    },
  },
  Subscription: {
    userEvents: {
      subscribe: (_, __, { pubsub }) => {console.log('Subscription resolver received pubsub:', !!pubsub);
        return pubsub.asyncIterator(['USER_EVENTS']);
      }
    },
    userAnalytics: {
      subscribe: (_, __, { pubsub }) =>
        pubsub.asyncIterator(['USER_ANALYTICS']),
    },
  },
};

module.exports = { typeDefs, resolvers };
