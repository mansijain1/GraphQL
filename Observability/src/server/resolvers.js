import { books } from "../data/bookData.js";
import { cacheControlFromInfo } from '@apollo/cache-control-types';
import { performance } from 'node:perf_hooks';

const traceResolver = (resolver) => async (parent, args, context, info) => {
  const start = performance.now();
  const result = await resolver(parent, args, context, info);
  const end = performance.now();
  console.log(`Resolver ${info.parentType.name}.${info.fieldName} took ${(end - start).toFixed(2)}ms`);
  return result;
};

export const resolvers = {
  Query: {
    bookById: async (_, { id }, { bookLoader} , info) => {
      const cacheControl = cacheControlFromInfo(info);
      cacheControl.setCacheHint({ maxAge: 60, scope: 'PRIVATE' }); // dynamic cache- override schema level hints
      return bookLoader.load(id);
    },
    allBooks: () => books,
  },
  Book: {
    id: traceResolver((b) => b.id),
    title: traceResolver((b) => b.title),
    author: traceResolver((b) => b.author),
  },
};

