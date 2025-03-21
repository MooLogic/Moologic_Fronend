import type React from "react"
import { Toaster } from "@/components/ui/toaster"

interface DairyLayoutProps {
  children: React.ReactNode
}

export function DairyLayout({ children }: DairyLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {children}
      <Toaster />
    </div>
  )
}

