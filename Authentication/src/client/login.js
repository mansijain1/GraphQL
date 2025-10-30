export const login = async () => {
  const query = `mutation login($username: String!, $password: String!) { login(username: $username, password: $password) }`;

  const response = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: { username: "alice", password: "password123" },
    }),
  });

  const data = await response.json();

  if (data.errors) {
    console.error("Login error:", data.errors);
    throw new Error(data.errors[0].message);
  }

  const token = data.data.login;
  console.log("JWT token received:", token);
  return token;
};
