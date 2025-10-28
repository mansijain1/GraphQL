import { commentsDB } from '../data/comments.js';
import { productsDB, relatedProductsDB } from '../data/products.js';

export const resolvers = {
  Query: {
    products: () => productsDB,
  },

  Product: {
    comments: async (parent) => {
      console.log(`Fetching comments for ${parent.name}...`);
      await new Promise((r) => setTimeout(r, 2000));
      return commentsDB[parent.id] || [`No comments for ${parent.name}`];
    },

    relatedProducts: async function* (parent) {
      for (const product of relatedProductsDB) {
        await new Promise((r) => setTimeout(r, 1000));
        yield product;
      }
    },
  },
};






