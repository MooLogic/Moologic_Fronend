import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      farm?: {
        id: string
        name: string
        location: string
      }
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string
    farm?: {
      id: string
      name: string
      location: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    farm?: {
      id: string
      name: string
      location: string
    }
  }
}

