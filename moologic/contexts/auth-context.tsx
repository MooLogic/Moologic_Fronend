"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "worker" | "government" | "user";
  image?: string;
  farm?: {
    id: string;
    name: string;
    location: string;
  };
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [effectiveRole, setEffectiveRole] = useState<User["role"] | null>(null);
  const [effectiveFarm, setEffectiveFarm] = useState<User["farm"] | null>(null);

  const user: User | null = session?.user
    ? {
        id: session.user.id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        role:
          (session.user.role as "owner" | "worker" | "government" | "user") ||
          "",
        image: session.user.image ?? undefined,
        farm: session.user.farm,
      }
    : null;

  // Effect for fetching user data
  useEffect(() => {
    if (status === "loading") return;

    const fetchUserData = async () => {
      if (!user) {
        setIsLoading(false);
        router.push("/landing");
        return;
      }

      try {
        if (
          session?.user?.role &&
          (session.user.role !== "owner" || session.user.farm)
        ) {
          setEffectiveRole(session.user.role as User["role"]);
          setEffectiveFarm(session.user.farm || null);
        } else {
          setIsLoading(true);
          const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
          const response = await fetch(`${baseURL}/auth/user/${user.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const userData: User = await response.json();
          setEffectiveRole(userData.role);
          setEffectiveFarm(userData.farm || null);
        }
      } catch (error: any) {
        setError(error.message || "Failed to fetch user data");
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, status, router]);

  // Separate effect for redirection logic
  useEffect(() => {
    if (isLoading || status === "loading") return; // Wait for loading to complete

    console.log("Redirection check - role:", effectiveRole, "farm:", effectiveFarm);

    if (!effectiveRole) {
      console.log("No role found, redirecting to role selection");
      router.push("/auth/role-selection");
    } else if (effectiveRole === "owner" && !effectiveFarm) {
      router.push("/auth/create-farm");
    } else if (effectiveRole === "government") {
      router.push("/government/dashboard");
    } else if (effectiveRole === "worker" && !effectiveFarm) {
      router.push("/auth/join-farm");
    }
  }, [effectiveRole, effectiveFarm, isLoading, status, router]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
        return false;
      }

      return true;
    } catch (error: any) {
      setError(error.message || "Login failed");
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/auth/login");
    } catch (error: any) {
      setError(error.message || "Logout failed");
    }
  };

  const clearError = () => {
    setError(null);
  };

  const updateUser = (userData: Partial<User>) => {
    console.log("User update requested:", userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        error,
        clearError,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}