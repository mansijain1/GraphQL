import jwt from "jsonwebtoken";
import { users } from "../data/users.js";

export const resolvers = {
  Query: {
    me: (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return user;
    },
    // me: (_, __, { user }) => user,
    userById: (_, { id }) => {
      const found = users.find((u) => u.id === Number(id));
      if (!found) throw new Error("User not found");
      return found;
    },
    users: () => users,
  },

  Mutation: {
    login: (_, { username, password }) => {
      const user = users.find(
        (u) => u.username === username && u.password === password
      );
      if (!user) throw new Error("Invalid credentials");

      // return jwt.sign({ id: user.id, username: user.username , role: user.role  },
      //   process.env.JWT_SECRET, 
      //   { expiresIn: "1h" }
      //   );

       return jwt.sign({ id: user.id, username: user.username },
        process.env.JWT_SECRET, 
        { expiresIn: "1h" }
        );
    },  

    createUser: (_, { username, password }) => {
      if (users.find((u) => u.username === username)) {
        throw new Error("Username already exists");
      }

      const newUser = {
        id: users.length + 1,
        username,
        password,
      };
      users.push(newUser);
      return newUser;
    },
  },
};
