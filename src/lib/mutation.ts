const GRAPHQL_API_URL = "https://optimaize-api.onrender.com/graphql";

interface User {
  id: number;
  email: string;
  role: string;
  credits: number;
}

// Generic fetch function
async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, any>,
  token?: string
): Promise<T> {
  const response = await fetch(GRAPHQL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();
  if (!response.ok)
    throw new Error(result?.errors?.[0]?.message || "Network error");
  if (result.errors) throw new Error(result.errors[0].message);
  return result.data as T;
}

// AUTH FUNCTIONS
export async function login(email: string, password: string): Promise<string> {
  const query = `
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
      }
    }
  `;
  const data = await graphqlRequest<{ login: { token: string } }>(query, {
    email,
    password,
  });
  if (!data.login?.token) throw new Error("Login failed: No token returned");
  return data.login.token;
}

export async function register(email: string, password: string): Promise<User> {
  const query = `
    mutation Register($email: String!, $password: String!) {
      register(email: $email, password: $password) {
        id
        email
        role
        credits
      }
    }
  `;
  const data = await graphqlRequest<{ register: User }>(query, {
    email,
    password,
  });
  if (!data.register)
    throw new Error("Registration failed: No user data returned");
  return data.register;
}

export async function getMe(token: string): Promise<User> {
  const query = `
    query {
      me {
        id
        email
        role
        credits
      }
    }
  `;
  const data = await graphqlRequest<{ me: User }>(query, undefined, token);
  if (!data.me) throw new Error("Failed to fetch user data");
  return data.me;
}
