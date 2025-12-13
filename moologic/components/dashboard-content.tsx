"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "@/components/providers/language-provider"
import { useSession } from "next-auth/react"
import { StatCards } from "@/components/stat-cards"
import { TopCows } from "@/components/top-cows"
import { AnimalList} from "@/components/animal-list"
import { MilkProductionChart } from "@/components/milk-production-chart"
import { LactationDonutChart } from "@/components/lactation-donut-chart"
import { LessPerformingTable } from "@/components/less-performing-table"
import { MilkProductionStatsChart } from "@/components/milk-production-stats-chart"
import { FinancialSummaryCard } from "@/components/financial-summary-card"
import { QuickActions } from "@/components/quick-actions"
// simplified dashboard: removed framer-motion for cleaner, performant UI
import { useGetPregnantCattleQuery } from "@/lib/service/cattleService"
import { useGetInseminationsQuery, useGetPendingPregnancyChecksQuery } from "@/lib/service/inseminationService"
import { useGetBirthRecordsQuery } from "@/lib/service/cattleService"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react"

interface Animal {
  id: number;
  ear_tag_no: string;
  name: string;
  breed: string;
  dob: string;
  status: string;
  last_milk_yield: number;
}

interface CowPerformance {
  id: number;
  ear_tag_no: string;
  avg_milk: number;
  improvement: number;
  decline: number;
}

export function DashboardContent() {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data from various endpoints
  const { data: pregnantCattle, error: pregnantError } = useGetPregnantCattleQuery({
    accessToken: session?.user?.accessToken || ''
  })

  const { data: inseminations, error: inseminationError } = useGetInseminationsQuery({
    accessToken: session?.user?.accessToken || ''
  })

  const { data: pendingChecks, error: pendingChecksError } = useGetPendingPregnancyChecksQuery({
    accessToken: session?.user?.accessToken || ''
  })

  const { data: birthRecords, error: birthRecordsError } = useGetBirthRecordsQuery({
    accessToken: session?.user?.accessToken || ''
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (pregnantError || inseminationError || pendingChecksError || birthRecordsError) {
      setError('Failed to load farm data')
    } else {
      setError(null)
    }
    setLoading(false)
  }, [pregnantError, inseminationError, pendingChecksError, birthRecordsError])

  if (!mounted) return null

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{t("Dashboard")}</h1>
          <p className="text-muted-foreground">{t("Welcome to your dairy farm management dashboard.")}</p>
        </div>

        {/* Top stat cards (summary) */}
        <div>
          <StatCards />
        </div>

        {/* Main content: two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent>
                <h3 className="text-lg font-medium mb-3">Milk Production Overview</h3>
                <MilkProductionStatsChart
                  data={[{ date: '2025-06-01', liters: 250 },{ date: '2025-06-02', liters: 260 },{ date: '2025-06-03', liters: 270 },{ date: '2025-06-04', liters: 280 },{ date: '2025-06-05', liters: 290 }]}
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent>
                  <h3 className="text-lg font-medium mb-3">All Animals</h3>
                  <AnimalList onSelectAnimal={(animal: Animal) => console.log("Selected animal:", animal)} />
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <h3 className="text-lg font-medium mb-3">Less Performing Cattle</h3>
                  <LessPerformingTable data={[]} milkRecords={[]} />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar (1/3) */}
          <aside className="space-y-6">
            <Card>
              <CardContent>
                <QuickActions />
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="text-lg font-medium mb-3">Recent Births</h3>
                <div className="space-y-2">
                  {birthRecords?.results?.slice(0, 5).map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-2 border-b">
                      <div>
                        <p className="font-medium">{record.cattle.ear_tag_no}</p>
                        <p className="text-sm text-muted-foreground">{record.calving_date} - {record.calf_count} calves</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        record.calving_outcome === 'successful' ? 'bg-green-100 text-green-800' :
                        record.calving_outcome === 'complications' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {record.calving_outcome}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="text-lg font-medium mb-3">Pending Checks</h3>
                <div className="space-y-2">
                  {pendingChecks?.map((check) => (
                    <div key={check.id} className="flex items-center justify-between p-2 border-b">
                      <div>
                        <p className="font-medium">{check.cattle.ear_tag_no}</p>
                        <p className="text-sm text-muted-foreground">Check due: {check.pregnancy_check_date}</p>
                      </div>
                      <div className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">Pending</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}

