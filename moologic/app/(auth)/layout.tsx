"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { LoadingScreen } from "@/components/loading-screen"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return <LoadingScreen />
  }

  return <div className="min-h-screen flex items-center justify-center">{children}</div>
}

