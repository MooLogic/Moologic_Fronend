"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { LoadingScreen } from "@/components/loading-screen"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: Array<"owner" | "worker" | "government" | "user">
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
    } else if (
      !isLoading &&
      isAuthenticated &&
      allowedRoles &&
      session?.user?.role &&
      !allowedRoles.includes(session.user.role as any)
    ) {
      router.push("/unauthorized")
    }
  }, [isAuthenticated, isLoading, router, allowedRoles, session])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return null
  }

  if (allowedRoles && session?.user?.role && !allowedRoles.includes(session.user.role as any)) {
    return null
  }

  return <>{children}</>
}

