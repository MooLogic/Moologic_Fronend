import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { jwtDecode } from "jwt-decode";

// Utility: Check if token is expired
function isTokenExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return Date.now() >= exp * 1000;
  } catch (e) {
    console.error("Error decoding token:", e);
    return true;
  }
}

// Utility: Refresh the access token
async function refreshAccessToken(token: any) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";
    console.log("Refreshing token at:", `${baseUrl}/auth/refresh-token/`);
    const res = await fetch(`${baseUrl}/auth/refresh-token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: token.refreshToken }),
    });

    const data = await res.json();

    if (!res.ok || !data.access_token) {
      throw new Error(`Refresh failed: HTTP ${res.status}`);
    }

    console.log("Token refreshed successfully");
    return {
      ...token,
      accessToken: data.access_token,
      error: null,
    };
  } catch (err) {
    console.error("Error refreshing access token:", err);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing credentials");
          return null;
        }

        try {
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";
          console.log("Attempting login at:", `${baseUrl}/auth/login/`);
          const res = await fetch(`${baseUrl}/auth/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (res.ok && data.access_token && data.user) {
            // Clear localStorage
            if (typeof window !== "undefined") {
              localStorage.removeItem("userRole");
              localStorage.removeItem("farm_name");
              console.log("Cleared localStorage: userRole, farm_name");
            }

            console.log("Login successful for user:", data.user.email);
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.username,
              role: data.user.role || "user",
              farm: data.user.farm || null,
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
            };
          }

          console.error("Login failed:", data);
          return null;
        } catch (err) {
          console.error("Error in authorize:", err);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      // Initial sign-in
      if (user) {
        console.log("Initial sign-in for user:", user.email);
        return {
          ...token,
          id: user.id,
          role: user.role || "user",
          farm: user.farm || null,
          name: user.name,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        };
      }

      // Check if accessToken is expired
      if (token.accessToken && isTokenExpired(token.accessToken)) {
        console.log("Access token expired, refreshing...");
        return await refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.farm = token.farm;
        session.user.name = token.name;
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET || "mNzzK3uJwbfTYLRr7OIY2qiIrm+n3ccUCTbDRKAgKf4=",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };