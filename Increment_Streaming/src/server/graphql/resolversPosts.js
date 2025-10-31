import { posts, authors} from '../data/posts.js'

export const resolvers = {
  Query: {
    posts: async function* () {
      for (const post of posts) {
        yield post;
        await new Promise((r) => setTimeout(r, 1200)); 
      }
    },
  },
  Post: {
    author: async (post) => {
      await new Promise((r) => setTimeout(r, 2000)); 
      return authors[post.authorId];
    },
  },
};