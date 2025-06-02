"use client"

import { useSearchParams } from "next/navigation"
import { HealthRecords } from "@/components/health-records"
import { DecorativeBackground } from "@/components/decorative-background"
import { ErrorBoundary } from "@/components/error-boundary"

export default function HealthRecordsPage() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "treatments"
  const cattleId = searchParams.get("cattle")

  return (
    <div className="relative p-6">
      <DecorativeBackground />
      <ErrorBoundary>
        <HealthRecords defaultTab={tab} selectedCattleId={cattleId} />
      </ErrorBoundary>
    </div>
  )
}

