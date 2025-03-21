import type React from "react"
import { DairyLayout } from "@/components/dairy-layout"
import { ProtectedRoute } from "@/components/protected-route"

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <DairyLayout>{children}</DairyLayout>
    </ProtectedRoute>
  )
}

