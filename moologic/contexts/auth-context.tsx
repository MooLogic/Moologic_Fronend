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
  const router = useRouter();
  const { data: session, status } = useSession();
  const [effectiveRole, setEffectiveRole] = useState<User["role"] | null>(null);
  const [effectiveFarm, setEffectiveFarm] = useState<User["farm"] | null>(null);

  useEffect(() => {
    if (session?.user?.role) {
      localStorage.removeItem("userRole");
      setEffectiveRole(session.user.role as User["role"]);
    } else {
      const storedRole = localStorage.getItem("userRole") as
        | User["role"]
        | null;
      setEffectiveRole(storedRole);
    }

    if (session?.user?.farm) {
      localStorage.removeItem("farm_name");
      setEffectiveFarm(session.user.farm);
    } else {
      const storedFarm = localStorage.getItem("farm_name") as
        | User["farm"]
        | null;
      setEffectiveFarm(storedFarm);
    }
    
  }, [session]);

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

  const isLoading = status === "loading";
  console.log("AuthProvider session:", user?.role);
  // Redirection logic centralized here

  

  const role = effectiveRole
  const Farm = effectiveFarm

  console.log("Effective role:", role);
  console.log("Effective farm:", Farm);
  console.log(session?.user)
  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/landing");
    } else if (!role) {
      console.log("No role found, redirecting to role selection");
      router.push("/auth/role-selection");
    } else if (role && role === "owner" && !Farm) {
      router.push("/auth/create-farm");
    } else if (role === "government") {
      router.push("/government/dashboard");
    } else if (role === "worker" && !Farm) {
      router.push("/auth/join-farm");
    }
  }, [user, isLoading, router]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return false;
      }

      return true;
    } catch (error: any) {
      setError(error.message || "Login failed");
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
