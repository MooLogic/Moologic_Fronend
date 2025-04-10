// components/ProtectedRoute.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context" // adjust import path as needed

export default function FarmProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/landing") // not logged in
      } else if (!user.role) {
        router.push("/auth/role-selection") // no role
      } else if (!user.farm && user.role !== "government") {
        router.push("/auth/create-farm") // no farm, unless government
      } else if (user.role === "government" && user.farm) {
        router.push("/government/dashboard") // government user with farm
      }
    }
  }, [user, isLoading, router])

  if (isLoading || !user) return null // or a loading spinner

  return <>{children}</>
}
