"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [effectiveRole, setEffectiveRole] = useState<User["role"] | null>(null);
  const [effectiveFarm, setEffectiveFarm] = useState<User["farm"] | null>(null);
  const [hasRedirected, setHasRedirected] = useState(false);

  const user: User | null = session?.user
    ? {
        id: session.user.id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        role:
          (session.user.role as "owner" | "worker" | "government" | "user") ||
          "user",
        image: session.user.image ?? undefined,
        farm: session.user.farm,
      }
    : null;

  // Effect for fetching user data and handling role/farm
  useEffect(() => {
    if (status === "loading") {
      console.log("Session loading, skipping fetchUserData");
      return;
    }

    const fetchUserData = async () => {
      if (!user || status !== "authenticated") {
        console.log("No authenticated user, setting default states");
        setEffectiveRole(null);
        setEffectiveFarm(null);
        setIsLoading(false);
        return;
      }

      try {
        // Prioritize session data
        if (session?.user?.role) {
          setEffectiveRole(session.user.role as User["role"]);
          setEffectiveFarm(session.user.farm || null);
          console.log("Using session data:", {
            id: user.id,
            email: user.email,
            role: session.user.role,
            farm: session.user.farm,
            accessToken: session.user.accessToken ? "[redacted]" : null,
          });
          // Clear localStorage
          localStorage.removeItem("userRole");
          localStorage.removeItem("farm_name");
        } else {
          // Fetch from API if no session role
          console.log("No role in session, fetching from API");
          setIsLoading(true);
          const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";
          const url = `${baseURL}/auth/user/${user.id}`;
          console.log(`Fetching user data from ${url}`);
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(session?.user?.accessToken && {
                Authorization: `Bearer ${session.user.accessToken}`,
              }),
            },
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const userData: User = await response.json();
          const apiRole = userData.role || "user";
          const apiFarm = userData.farm || null;
          setEffectiveRole(apiRole);
          setEffectiveFarm(apiFarm);
          console.log("Using API data:", { role: apiRole, farm: apiFarm });
          // Clear localStorage
          localStorage.removeItem("userRole");
          localStorage.removeItem("farm_name");
        }
      } catch (error: any) {
        console.error("Fetch user data error:", error.message);
        // Fall back to localStorage
        const storedRole = localStorage.getItem("userRole") as User["role"] | null;
        let storedFarm: User["farm"] | null = null;
        const farmName = localStorage.getItem("farm_name");
        if (farmName) {
          try {
            storedFarm = JSON.parse(farmName);
            if (!storedFarm?.id || !storedFarm?.name || !storedFarm?.location) {
              storedFarm = null;
            }
          } catch (e) {
            storedFarm = null;
          }
        }
        setEffectiveRole(storedRole || null); // Avoid defaulting to "user"
        setEffectiveFarm(storedFarm);
        console.log("Using localStorage fallback:", {
          role: storedRole || null,
          farm: storedFarm,
        });
        setError(error.message || "Failed to fetch user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, status, session?.user?.accessToken]);

  // Effect for redirection
  useEffect(() => {
    if (isLoading || status === "loading" || hasRedirected) {
      console.log("Skipping redirect: isLoading, status loading, or hasRedirected");
      return;
    }

    console.log("Redirect useEffect triggered:", {
      user: user ? { id: user.id, email: user.email, role: user.role } : null,
      effectiveRole,
      effectiveFarm,
      isLoading,
      status,
      pathname,
    });

    let targetPath: string | null = null;

    // Redirect unauthenticated users to login
    if (!user || status !== "authenticated") {
      if (!pathname.startsWith("/auth") && pathname !== "/landing") {
        targetPath = "/auth/login";
      }
    } else if (!effectiveRole && pathname !== "/auth/role-selection") {
      targetPath = "/auth/role-selection";
    } else if (
      effectiveRole === "government" &&
      pathname !== "/government/dashboard"
    ) {
      // For government users, redirect to dashboard only if they're not already there
      targetPath = "/government/dashboard";
    } else if (
      effectiveRole === "owner" &&
      !effectiveFarm &&
      pathname !== "/auth/create-farm"
    ) {
      targetPath = "/auth/create-farm";
    } else if (
      effectiveRole === "worker" &&
      !effectiveFarm &&
      pathname !== "/auth/join-farm"
    ) {
      targetPath = "/auth/join-farm";
    }

    if (targetPath) {
      console.log(`Redirecting to ${targetPath}`);
      setHasRedirected(true);
      router.push(targetPath);
      setTimeout(() => setHasRedirected(false), 1000);
    }
  }, [effectiveRole, effectiveFarm, isLoading, status, user, router, pathname, hasRedirected]);

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
      localStorage.removeItem("userRole");
      localStorage.removeItem("farm_name");
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
    if (userData.role) {
      setEffectiveRole(userData.role);
      localStorage.setItem("userRole", userData.role);
    }
    if (userData.farm) {
      setEffectiveFarm(userData.farm);
      localStorage.setItem("farm_name", JSON.stringify(userData.farm));
    }
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