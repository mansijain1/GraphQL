import DataLoader from "dataloader";
import { users } from "../data/users.js";

export const createUserLoader = () =>
  new DataLoader(async (userIds) => {
    console.log("Batching user requests:", userIds);
    const foundUsers = userIds.map((id) => users.find((u) => u.id === Number(id)));
    return foundUsers;
  });
