import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

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
          return null;
        }

        // Call your Django backend to authenticate the user
        const res = await fetch("http://127.0.0.1:8000/auth/login/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const data = await res.json();
        console.log(data.user);
        if (res.ok && data.access_token && data.user) {
          // Return the user data with the access_token
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.username,
            role: data.user.role,
            farm: data.user.farm,
            accessToken: data.access_token,  // Store access_token here
            refreshToken: data.refresh_token,
          };
        }

        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Save the token in the JWT token when the user logs in
        token.id = user.id;
        token.role = user.role;
        token.farm = user.farm;
        token.name = user.name;
        token.accessToken = user.accessToken; // Store the access token here
        token
      }
      return token;
    },

    async session({ session, token }) {
      // Store token in session to be used later (e.g., in headers)
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.farm = token.farm;
        session.user.accessToken = token.accessToken; // Pass accessToken to the session
        session.user.refreshToken = token.refreshToken;
        
      }
      return session;
    },
  },
  
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  secret: "mNzzK3uJwbfTYLRr7OIY2qiIrm+n3ccUCTbDRKAgKf4=",  // Ideally, use process.env.NEXTAUTH_SECRET here
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
