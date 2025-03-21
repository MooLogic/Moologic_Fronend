import { FinanceDashboard } from "@/components/finance-dashboard"
import { DecorativeBackground } from "@/components/decorative-background"

export default function FinancePage() {
  return (
    <div className="relative p-6">
      <DecorativeBackground />
      <FinanceDashboard />
    </div>
  )
}

