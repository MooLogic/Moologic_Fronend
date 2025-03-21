import { GestationDashboard } from "@/components/gestation-dashboard"
import { DecorativeBackground } from "@/components/decorative-background"

export default function GestationPage() {
  return (
    <div className="relative p-6">
      <DecorativeBackground />
      <GestationDashboard />
    </div>
  )
}

