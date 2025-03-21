"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardContent } from "@/components/dashboard-content"

export function DairyDashboard() {
  const [mounted, setMounted] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex min-h-screen bg-gray-50">
     
      <DashboardContent sidebarCollapsed={sidebarCollapsed} />
    </div>
  )
}

