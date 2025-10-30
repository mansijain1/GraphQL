export const getUser = async (token) => {
  const query = `query me { me { id username role } }`;

  const response = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();

  if (data.errors) {
    console.error("Fetch user error:", data.errors);
    throw new Error(data.errors[0].message);
  }

  console.log("Authenticated user:", data.data.me);
  return data.data.me;
};
