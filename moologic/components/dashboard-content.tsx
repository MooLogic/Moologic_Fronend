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
import { motion } from "framer-motion"
import { useGetPregnantCattleQuery } from "@/lib/service/cattleService"
import { useGetInseminationsQuery, useGetPendingPregnancyChecksQuery } from "@/lib/service/inseminationService"
import { useGetBirthRecordsQuery } from "@/lib/service/cattleService"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
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
    <div className="relative">
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-40 left-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <motion.h1
            className="text-3xl font-bold tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t("Dashboard")}
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("Welcome to your dairy farm management dashboard.")}
          </motion.p>
        </div>

        {/* Quick Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-primary/5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pregnant Cattle</p>
                  <p className="text-2xl font-bold">{pregnantCattle?.count || 0}</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-primary/5">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending Checks</p>
                  <p className="text-2xl font-bold">{pendingChecks?.length || 0}</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-primary/5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Recent Births</p>
                  <p className="text-2xl font-bold">{birthRecords?.count || 0}</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-primary/5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Inseminations</p>
                  <p className="text-2xl font-bold">{inseminations?.count || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="text-lg font-semibold mb-4">Recent Birth Records</h3>
              <div className="space-y-2">
                {birthRecords?.results?.slice(0, 5).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-2 border-b">
                    <div>
                      <p className="font-medium">{record.cattle.ear_tag_no}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.calving_date} - {record.calf_count} calves
                      </p>
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
            </div>
          </div>
          <div>
            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="text-lg font-semibold mb-4">Pending Pregnancy Checks</h3>
              <div className="space-y-2">
                {pendingChecks?.map((check) => (
                  <div key={check.id} className="flex items-center justify-between p-2 border-b">
                    <div>
                      <p className="font-medium">{check.cattle.ear_tag_no}</p>
                      <p className="text-sm text-muted-foreground">
                        Check due: {check.pregnancy_check_date}
                      </p>
                    </div>
                    <div className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">
                      Pending
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Metrics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="text-lg font-semibold mb-4">Top Performing Cattle</h3>
              <div className="space-y-2">
                {/* Example data - replace with actual API data */}
                {[1, 2, 3].map((id) => (
                  <div key={id} className="p-2 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">ET-00{id}</p>
                        <p className="text-sm text-muted-foreground">
                          Avg Milk: 25 liters/day
                        </p>
                      </div>
                      <div className="text-green-500">
                        ↑ 15%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="text-lg font-semibold mb-4">Less Performing Cattle</h3>
              <div className="space-y-2">
                {/* Example data - replace with actual API data */}
                {[4, 5, 6].map((id) => (
                  <div key={id} className="p-2 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">ET-00{id}</p>
                        <p className="text-sm text-muted-foreground">
                          Avg Milk: 15 liters/day
                        </p>
                      </div>
                      <div className="text-red-500">
                        ↓ 10%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Financial and Production Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="grid gap-6 md:grid-cols-2"
        >
          <div>
            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="text-lg font-semibold mb-4">Milk Production Overview</h3>
              <MilkProductionStatsChart
                data={[
                  { date: '2025-06-01', liters: 250 },
                  { date: '2025-06-02', liters: 260 },
                  { date: '2025-06-03', liters: 270 },
                  { date: '2025-06-04', liters: 280 },
                  { date: '2025-06-05', liters: 290 }
                ]}
              />
            </div>
          </div>
          <div>
            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="text-lg font-semibold mb-4">Financial Summary</h3>
              <FinancialSummaryCard 
                title={t("Financial Summary")}
                value={10000}
                change={5}
                trend="up"
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7"></path></svg>}
              />
            </div>
          </div>
        </motion.div>

        {/* Animal List Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="text-lg font-semibold mb-4">All Animals</h3>
              <AnimalList onSelectAnimal={(animal: Animal) => console.log("Selected animal:", animal)} />
            </div>
          </div>
          <div>
            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
              <div className="space-y-2">
                {/* Example data - replace with actual API data */}
                {[1, 2, 3].map((id) => (
                  <div key={id} className="p-2 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Vaccination Due</p>
                        <p className="text-sm text-muted-foreground">
                          Due on: 2025-06-10
                        </p>
                      </div>
                      <div className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">
                        High Priority
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

