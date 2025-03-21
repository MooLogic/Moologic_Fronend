import { HealthRecords } from "@/components/health-records"
import { DecorativeBackground } from "@/components/decorative-background"

export default function HealthRecordsPage() {
  return (
    <div className="relative p-6">
      <DecorativeBackground />
      <HealthRecords />
    </div>
  )
}

