"use client"

import { useTranslation } from "@/components/providers/language-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MilkProductionChart } from "@/components/milk-production-chart"
import { LactationDonutChart } from "@/components/lactation-donut-chart"
import { MilkProductionStatsChart } from "@/components/milk-production-stats-chart"
import { TopCows } from "@/components/top-cows"
import { LessPerformingTable } from "@/components/less-performing-table"
import { DateRangePicker } from "@/components/date-range-picker"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { 
  useGetFarmProductionLast7DaysQuery,
  useGetFarmProductionLast30DaysQuery,
  useGetFarmProductionLast90DaysQuery,
  useGetTodayProductionStatsQuery,
  useGetMilkRecordsQuery
} from "@/lib/service/milkService"
import { 
  useGetLactatingCattleQuery,
  useGetCattleDataQuery
} from "@/lib/service/cattleService"
import { format, subDays } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Milk, TrendingUp, TrendingDown, Target, Calendar, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { MilkYieldReport } from "@/components/milk-yield-report"

interface MilkRecord {
  id: number;
  ear_tag_no: string;
  quantity: number;
  date: string;
  time: string;
  shift: string;
}

interface LactatingCattle {
  id: number;
  ear_tag_no: string;
  name: string;
  milking_frequency: number;
  last_milking: string | null;
  can_milk_now: boolean;
  days_in_milk: number;
  lactation_number: number;
}

interface CowProduction {
  ear_tag_no: string;
  totalProduction: number;
  recordCount: number;
  averageProduction: number;
}

interface LactationDistribution {
  [key: string]: number;
}

// Add Woods model parameters
const WOODS_PARAMS = {
  a: 20, // Scale parameter (peak production)
  b: 0.05, // Rate of increase to peak
  c: 0.003, // Rate of decline after peak
}

// Calculate estimated production using Woods model
const calculateWoodsModel = (daysInMilk: number) => {
  const { a, b, c } = WOODS_PARAMS;
  return a * Math.pow(daysInMilk, b) * Math.exp(-c * daysInMilk);
};

export function MilkYieldDashboard() {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ""

  // Fetch all required data
  const { data: farmProduction30Days, isLoading: isLoading30Days } = useGetFarmProductionLast30DaysQuery(
    { accessToken },
    { skip: !accessToken }
  )

  const { data: farmProduction7Days, isLoading: isLoading7Days } = useGetFarmProductionLast7DaysQuery(
    { accessToken },
    { skip: !accessToken }
  )

  const { data: farmProduction90Days, isLoading: isLoading90Days } = useGetFarmProductionLast90DaysQuery(
    { accessToken },
    { skip: !accessToken }
  )

  const { data: todayStats, isLoading: isLoadingToday } = useGetTodayProductionStatsQuery(
    accessToken,
    { skip: !accessToken }
  )

  const { data: lactatingCattleResponse, isLoading: isLoadingLactating } = useGetLactatingCattleQuery(
    { accessToken },
    { skip: !accessToken }
  )

  const { data: allCattle, isLoading: isLoadingCattle } = useGetCattleDataQuery(
    { accessToken },
    { skip: !accessToken }
  )

  const { data: milkRecords, isLoading: isLoadingRecords } = useGetMilkRecordsQuery(
    accessToken,
    { skip: !accessToken }
  )

  // Calculate production metrics
  const calculateMetrics = () => {
    if (!farmProduction30Days || !farmProduction7Days || !todayStats) return null

    const totalProduction = farmProduction30Days.reduce((sum, record) => sum + record.total_production, 0)
    const estimatedTotal = farmProduction30Days.reduce((sum, record) => sum + (record.estimated_production || 0), 0)

    // Calculate trend (comparing last 7 days to previous 7 days)
    const last7Days = farmProduction7Days
    const previous7Days = farmProduction30Days.slice(7, 14)
    const last7Total = last7Days?.reduce((sum, record) => sum + record.total_production, 0) || 0
    const previous7Total = previous7Days?.reduce((sum, record) => sum + record.total_production, 0) || 0
    const trend = previous7Total ? ((last7Total - previous7Total) / previous7Total) * 100 : 0

    // Calculate efficiency (actual vs estimated)
    const efficiency = estimatedTotal ? (totalProduction / estimatedTotal) * 100 : 0

    // Calculate lactation stage distribution
    const lactatingCattle = lactatingCattleResponse?.results || []
    const lactationDistribution = lactatingCattle.reduce((acc: LactationDistribution, cow: LactatingCattle) => {
      const stage = getLactationStage(cow.days_in_milk)
      acc[stage] = (acc[stage] || 0) + 1
      return acc
    }, {})

    return {
      totalProduction,
      estimatedTotal,
      trend,
      efficiency,
      averageDaily: totalProduction / 30,
      todayProduction: todayStats.total_production,
      activeMilkingCattle: todayStats.active_milking_cattle,
      recordsToday: todayStats.records_count,
      lactationDistribution
    }
  }

  const getLactationStage = (daysInMilk: number) => {
    if (daysInMilk <= 100) return 'early'
    if (daysInMilk <= 200) return 'mid'
    return 'late'
  }

  // Update prepareChartData function
  const prepareChartData = () => {
    if (!farmProduction90Days || !lactatingCattleResponse) return [];

    return farmProduction90Days.map(record => {
      // Calculate total estimated production for this date
      const totalEstimated = lactatingCattleResponse.results.reduce((sum, cow) => {
        const daysInMilk = cow.days_in_milk;
        return sum + calculateWoodsModel(daysInMilk);
      }, 0);

      return {
        date: format(new Date(record.date), 'MMM dd'),
        actual: record.total_production,
        estimated: totalEstimated,
        difference: ((record.total_production - totalEstimated) / totalEstimated) * 100
      };
    });
  };

  // Calculate top performing cows
  const calculateTopCows = () => {
    if (!milkRecords || !lactatingCattleResponse) return []

    const cowProduction: { [key: string]: CowProduction } = {}
    milkRecords.forEach((record: MilkRecord) => {
      if (!cowProduction[record.ear_tag_no]) {
        cowProduction[record.ear_tag_no] = {
          ear_tag_no: record.ear_tag_no,
          totalProduction: 0,
          recordCount: 0,
          averageProduction: 0
        }
      }
      cowProduction[record.ear_tag_no].totalProduction += record.quantity
      cowProduction[record.ear_tag_no].recordCount++
    })

    return Object.values(cowProduction)
      .map(cow => ({
        ...cow,
        averageProduction: cow.totalProduction / cow.recordCount
      }))
      .sort((a, b) => b.averageProduction - a.averageProduction)
      .slice(0, 5)
  }

  const chartData = prepareChartData()
  const metrics = calculateMetrics()
  const topCows = calculateTopCows()

  const isLoading = isLoading30Days || isLoading7Days || isLoading90Days || 
                   isLoadingToday || isLoadingLactating || isLoadingCattle || 
                   isLoadingRecords

  // Add this function to prepare report data
  const prepareReportData = () => {
    if (!milkRecords || !metrics) return null;

    return {
      milkRecords,
      totalProduction: metrics.totalProduction,
      averageDaily: metrics.averageDaily,
      activeCattle: metrics.activeMilkingCattle,
      efficiency: metrics.efficiency
    };
  };

  if (!accessToken) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>Please sign in to view the dashboard.</AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="relative">
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-40 left-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <motion.h1
            className="text-3xl font-bold tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t("Milk Yield Dashboard")}
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("Monitor and analyze milk production across your herd.")}
          </motion.p>
        </div>

        <motion.div
          className="flex justify-end gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <DateRangePicker />
          {metrics && <MilkYieldReport data={prepareReportData()!} />}
        </motion.div>

        {metrics && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Production
                </CardTitle>
                <Milk className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.todayProduction.toFixed(1)} L</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.recordsToday} records from {metrics.activeMilkingCattle} cattle
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Weekly Trend
                </CardTitle>
                {metrics.trend >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <span className={metrics.trend >= 0 ? "text-green-600" : "text-red-600"}>
                    {metrics.trend >= 0 ? "+" : ""}{metrics.trend.toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">vs previous week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Production Efficiency
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{metrics.efficiency.toFixed(1)}%</div>
                  <Progress value={metrics.efficiency} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground">vs estimated production</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  30-Day Average
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.averageDaily.toFixed(1)} L</div>
                <p className="text-xs text-muted-foreground">per day</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted/50 backdrop-blur-sm">
            <TabsTrigger value="overview">{t("Overview")}</TabsTrigger>
            <TabsTrigger value="production">{t("Production")}</TabsTrigger>
            <TabsTrigger value="animals">{t("Animals")}</TabsTrigger>
            <TabsTrigger value="analytics">{t("Analytics")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Production Overview</CardTitle>
                    <CardDescription>
                      Daily milk production with Woods Model estimation
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">Peak Production: {WOODS_PARAMS.a}L</Badge>
                        <Badge variant="outline">Increase Rate: {WOODS_PARAMS.b}</Badge>
                        <Badge variant="outline">Decline Rate: {WOODS_PARAMS.c}</Badge>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MilkProductionChart data={chartData} />
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Lactation Stages</CardTitle>
                    <CardDescription>Distribution of lactating cattle</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LactationDonutChart data={metrics?.lactationDistribution} />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Cows</CardTitle>
                    <CardDescription>Highest average daily production</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TopCows data={topCows} />
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Production Analysis</CardTitle>
                    <CardDescription>Actual vs Expected Production</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MilkProductionStatsChart 
                      data={chartData} 
                      isLoading={isLoading30Days || isLoadingLactating}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="production" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("Production Trends")}</CardTitle>
                  <CardDescription>{t("Detailed production analysis over time")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <h4 className="text-sm font-semibold mb-4">90-Day Production Trend</h4>
                    <MilkProductionChart data={chartData} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-4">Efficiency Analysis</h4>
                    <MilkProductionStatsChart data={chartData} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="animals" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Lactating Cattle Overview</CardTitle>
                    <CardDescription>Current status of milking herd</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LessPerformingTable 
                      data={lactatingCattleResponse?.results || []}
                      milkRecords={milkRecords || []}
                      isLoading={isLoadingLactating || isLoadingRecords}
                    />
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("Advanced Analytics")}</CardTitle>
                  <CardDescription>{t("Detailed production metrics and predictions")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <h4 className="text-sm font-semibold mb-4">Production Efficiency Over Time</h4>
                    <MilkProductionStatsChart data={chartData} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-4">Lactation Stage Distribution</h4>
                    <LactationDonutChart data={metrics?.lactationDistribution} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-20 w-1/3">
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-3 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Skeleton className="h-10 w-full" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

