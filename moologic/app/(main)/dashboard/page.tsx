import { DashboardContent } from "@/components/dashboard-content"
import { DecorativeBackground } from "@/components/decorative-background"

export default function DashboardPage() {
  return (
    <div className="relative p-6">
      <DecorativeBackground />
      <DashboardContent />
    </div>
  )
}

