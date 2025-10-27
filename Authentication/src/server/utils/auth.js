import jwt from "jsonwebtoken";

// Function to extract user from JWT
export const getUserFromToken = (token) => {
  try {
    if (!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error("Invalid or expired token:", err.message);
    return null;
  }
};
