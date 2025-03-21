"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { useAuth } from "@/contexts/auth-context"
import { LoadingScreen } from "@/components/loading-screen"

export default function LoginPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "government") {
        router.push("/government/dashboard")
      } else {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}

