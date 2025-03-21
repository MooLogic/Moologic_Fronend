import type React from "react"
import { DairyLayout } from "@/components/dairy-layout"
import { ProtectedRoute } from "@/components/protected-route"

export default function GovernmentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={["government"]}>
      <DairyLayout>{children}</DairyLayout>
    </ProtectedRoute>
  )
}

