"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { signIn, signOut, useSession } from "next-auth/react"

type User = {
  id: string
  name: string
  email: string
  role: "owner" | "worker" | "government" | "user"
  image?: string
  farm?: {
    id: string
    name: string 
    location: string
  }
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  loginWithDemo: (role: "owner" | "worker" | "government") => Promise<boolean>
  logout: () => Promise<void>
  isLoading: boolean
  error: string | null
  clearError: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const demoUsers = {
  owner: {
    email: "demo.owner@example.com",
    password: "password123",
  },
  worker: {
    email: "demo.worker@example.com",
    password: "password123",
  },
  government: {
    email: "demo.government@example.com",
    password: "password123",
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { data: session, status } = useSession()

  const user: User | null = session?.user
    ? {
        id: session.user.id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        role: (session.user.role as "owner" | "worker" | "government" | "user") || "",
        image: session.user.image ?? undefined,
        farm: session.user.farm,
      }
    : null

  const isLoading = status === "loading"
  console.log("AuthProvider session:", user?.role)
  // Redirection logic centralized here

  const getEffectiveRole = (): User["role"] | null => {
    if (session?.user?.role) {
      localStorage.removeItem("userRole") // clean up
      return session.user.role as User["role"]
    }

    const storedRole = localStorage.getItem("userRole") as User["role"] | null
    return storedRole
  }

  const getEffectiveFarm = (): User["farm"] | null => {
    if (typeof window === "undefined") {
      return null; // Or some safe fallback
    }
  
    const storedFarm = localStorage.getItem("farm_name") as User["farm"] | null;
    return storedFarm;
  };
  

  const Farm = getEffectiveFarm()

  const role = getEffectiveRole()
  console.log("Effective role:", role)

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.push("/landing")
    } else if (!role) {
      router.push("/auth/role-selection")
    } else if (role && role === "owner" && !Farm ) {
      router.push("/auth/create-farm")
    } else if (role === "government") {
      router.push("/government/dashboard")
    } else if (role === "worker") {
      router.push("/auth/join-farm")
    }

  }, [user, isLoading, router])

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null)
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
        return false
      }

      return true
    } catch (error: any) {
      setError(error.message || "Login failed")
      return false
    }
  }

  const loginWithDemo = async (role: "owner" | "worker" | "government"): Promise<boolean> => {
    setError(null)
    try {
      const demoUser = demoUsers[role]
      const result = await signIn("credentials", {
        email: demoUser.email,
        password: demoUser.password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
        return false
      }

      return true
    } catch (error: any) {
      setError(error.message || "Demo login failed")
      return false
    }
  }

  const logout = async () => {
    try {
      await signOut({ redirect: false })
      router.push("/auth/login")
    } catch (error: any) {
      setError(error.message || "Logout failed")
    }
  }

  const clearError = () => {
    setError(null)
  }

  const updateUser = (userData: Partial<User>) => {
    console.log("User update requested:", userData)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithDemo,
        logout,
        isLoading,
        error,
        clearError,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
