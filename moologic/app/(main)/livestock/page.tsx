import { LivestockDashboard } from "@/components/livestock-dashboard"
import { DecorativeBackground } from "@/components/decorative-background"

export default function LivestockPage() {
  return (
    <div className="relative p-6">
      <DecorativeBackground />
      <LivestockDashboard />
    </div>
  )
}

