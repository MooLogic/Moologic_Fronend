"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { LoadingScreen } from "@/components/loading-screen"

export default function LogoutPage() {
  const { logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    logout()
    router.push("/auth/login")
  }, [logout, router])

  return <LoadingScreen />
}

