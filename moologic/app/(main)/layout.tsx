"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { CollapsibleSidebar } from "@/components/collapsible-sidebar"
import { LoadingScreen } from "@/components/loading-screen"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <CollapsibleSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}

