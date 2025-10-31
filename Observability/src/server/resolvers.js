import { books } from "../data/bookData.js";

const traceResolver = (resolver) => async (parent, args, context, info) => {
  const start = performance.now();
  const result = await resolver(parent, args, context, info);
  const end = performance.now();
  console.log(`Resolver ${info.parentType.name}.${info.fieldName} took ${(end - start).toFixed(2)}ms`);
  return result;
};

export const resolvers = {
  Query: {
    bookById: (_, { id }) => books.find((b) => b.id === id),
    allBooks: () => books,
  },
    Book: {
    id: traceResolver((b) => b.id),
    title: traceResolver((b) => b.title),
    author: traceResolver((b) => b.author),
  },
};

