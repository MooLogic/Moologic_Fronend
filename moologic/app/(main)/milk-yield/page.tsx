import { MilkYieldDashboard } from "@/components/milk-yield-dashboard"
import { DecorativeBackground } from "@/components/decorative-background"

export default function MilkYieldPage() {
  return (
    <div className="relative p-6">
      <DecorativeBackground />
      <MilkYieldDashboard />
    </div>
  )
}

