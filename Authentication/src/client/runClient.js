import { login } from "./login.js";
import { getUser } from "./getUser.js";

(async () => {
  try {
    const token = await login();
    await getUser(token);
  } catch (err) {
    console.error("Client error:", err.message);
  }
})();
