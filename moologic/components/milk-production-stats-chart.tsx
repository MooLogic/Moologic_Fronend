"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { useGetFarmProductionLast30DaysQuery } from "@/lib/service/milkService"
import { format, parseISO, subDays } from "date-fns"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useTheme } from "@/components/providers/theme-provider"
import { useMobile } from "@/hooks/use-mobile"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductionStats {
  morningAvg: number
  eveningAvg: number
  peakProduction: number
  lowestProduction: number
  variability: number
  weekdayAverages: Record<string, number>
}

interface ChartData {
  date: string;
  actual: number;
  estimated: number;
  difference: number;
}

interface MilkProductionStatsChartProps {
  data: ChartData[];
  isLoading?: boolean;
}

export function MilkProductionStatsChart({ data = [], isLoading = false }: MilkProductionStatsChartProps) {
  const { theme } = useTheme()
  const isMobile = useMobile()
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ""
  const [selectedView, setSelectedView] = useState<"daily" | "weekly" | "shift">("daily")
  const [processedData, setProcessedData] = useState<any[]>([])
  const [stats, setStats] = useState({
    averageProduction: 0,
    peakProduction: 0,
    averageEfficiency: 0,
    productionTrend: 0
  })

  const { data: farmProduction, isLoading: farmLoading } = useGetFarmProductionLast30DaysQuery(
    { accessToken },
    { skip: !accessToken }
  )

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Process data based on selected view
    const newData = processDataForView(data, selectedView);
    setProcessedData(newData);

    // Calculate statistics
    if (selectedView === "daily") {
      setStats({
        averageProduction: calculateAverage(data, 'actual'),
        peakProduction: Math.max(...data.map(d => d.actual)),
        averageEfficiency: calculateAverage(data, 'difference'),
        productionTrend: calculateTrend(data)
      });
    }
  }, [data, selectedView]);

  const calculateStats = (): ProductionStats | null => {
    if (!farmProduction) return null

    const morningRecords = farmProduction.filter(r => r.shift === "morning")
    const eveningRecords = farmProduction.filter(r => r.shift === "evening")

    const morningAvg = morningRecords.reduce((sum, r) => sum + r.total_production, 0) / morningRecords.length
    const eveningAvg = eveningRecords.reduce((sum, r) => sum + r.total_production, 0) / eveningRecords.length

    const allProduction = farmProduction.map(r => r.total_production)
    const peakProduction = Math.max(...allProduction)
    const lowestProduction = Math.min(...allProduction)

    // Calculate standard deviation for variability
    const mean = allProduction.reduce((sum, val) => sum + val, 0) / allProduction.length
    const squaredDiffs = allProduction.map(val => Math.pow(val - mean, 2))
    const variability = Math.sqrt(squaredDiffs.reduce((sum, val) => sum + val, 0) / allProduction.length)

    // Calculate averages by weekday
    const weekdayAverages = farmProduction.reduce((acc, record) => {
      const day = format(parseISO(record.date), 'EEEE')
      if (!acc[day]) {
        acc[day] = { total: 0, count: 0 }
      }
      acc[day].total += record.total_production
      acc[day].count++
      return acc
    }, {} as Record<string, { total: number; count: number }>)

    const weekdayStats = Object.entries(weekdayAverages).reduce((acc, [day, stats]) => {
      acc[day] = stats.total / stats.count
      return acc
    }, {} as Record<string, number>)

    return {
      morningAvg,
      eveningAvg,
      peakProduction,
      lowestProduction,
      variability,
      weekdayAverages: weekdayStats
    }
  }

  const prepareChartData = () => {
    if (!farmProduction) return []

    switch (selectedView) {
      case "daily":
        return farmProduction.map(record => ({
          date: format(parseISO(record.date), 'MMM dd'),
          production: record.total_production,
          estimated: record.estimated_production || record.total_production * 1.1
        }))

      case "weekly":
        const weeklyData = farmProduction.reduce((acc, record) => {
          const weekStart = format(parseISO(record.date), 'MMM dd')
          if (!acc[weekStart]) {
            acc[weekStart] = {
              production: 0,
              estimated: 0,
              count: 0
            }
          }
          acc[weekStart].production += record.total_production
          acc[weekStart].estimated += record.estimated_production || record.total_production * 1.1
          acc[weekStart].count++
          return acc
        }, {} as Record<string, { production: number; estimated: number; count: number }>)

        return Object.entries(weeklyData).map(([date, data]) => ({
          date,
          production: data.production / data.count,
          estimated: data.estimated / data.count
        }))

      case "shift":
        const stats = calculateStats()
        if (!stats) return []
        return [
          { name: "Morning", value: stats.morningAvg },
          { name: "Evening", value: stats.eveningAvg }
        ]

      default:
        return []
    }
  }

  if (farmLoading) {
    return <ChartSkeleton />
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Production Statistics</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No production data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Production Statistics</CardTitle>
            <CardDescription>Detailed milk production analysis</CardDescription>
          </div>
          <Select value={selectedView} onValueChange={(value: "daily" | "weekly" | "shift") => setSelectedView(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily View</SelectItem>
              <SelectItem value="weekly">Weekly Average</SelectItem>
              <SelectItem value="shift">Shift Analysis</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {selectedView === "shift" ? (
                <BarChart data={prepareChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-gray-800 p-2 border rounded-lg shadow-lg">
                            <p className="font-medium">{payload[0].payload.name}</p>
                            <p className="text-sm">
                              Average: {payload[0].value?.toFixed(1)} L
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="value" fill="#6366f1" />
                </BarChart>
              ) : (
                <BarChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Liters', angle: -90, position: 'insideLeft' }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Efficiency %', angle: 90, position: 'insideRight' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                    }}
                    formatter={(value: number, name: string) => {
                      if (name.includes('%')) {
                        return [`${value.toFixed(1)}%`, name];
                      }
                      return [`${value.toFixed(1)} L`, name];
                    }}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="actual"
                    fill="#2563eb"
                    name="Actual Production"
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="actualAvg"
                    fill="#93c5fd"
                    name="7-Day Average"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="efficiency"
                    fill="#16a34a"
                    name="Efficiency %"
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {selectedView === "daily" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <StatCard
                title="Average Production"
                value={stats.averageProduction}
                unit="L"
              />
              <StatCard
                title="Peak Production"
                value={stats.peakProduction}
                unit="L"
              />
              <StatCard
                title="Average Efficiency"
                value={stats.averageEfficiency}
                unit="%"
              />
              <StatCard
                title="Production Trend"
                value={stats.productionTrend}
                unit="%"
                trend
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function processDataForView(data: ChartData[], view: "daily" | "weekly" | "shift") {
  switch (view) {
    case "daily":
      return data.map((record, index, array) => {
        // Calculate 7-day moving average
        const movingAvgWindow = array.slice(Math.max(0, index - 6), index + 1)
        const actualAvg = movingAvgWindow.reduce((sum, r) => sum + r.actual, 0) / movingAvgWindow.length
        const efficiency = (record.actual / record.estimated) * 100

        return {
          ...record,
          actualAvg,
          efficiency
        }
      });

    case "weekly":
      const weeklyData = data.reduce((acc: any[], record) => {
        const weekStart = format(new Date(record.date), 'MMM dd')
        const existingWeek = acc.find(w => w.date === weekStart)

        if (existingWeek) {
          existingWeek.actual += record.actual
          existingWeek.estimated += record.estimated
          existingWeek.count += 1
        } else {
          acc.push({
            date: weekStart,
            actual: record.actual,
            estimated: record.estimated,
            count: 1
          })
        }
        return acc
      }, [])

      return weeklyData.map(week => ({
        ...week,
        actual: week.actual / week.count,
        estimated: week.estimated / week.count,
        efficiency: ((week.actual / week.estimated) * 100)
      }))

    case "shift":
      const morningAvg = calculateShiftAverage(data, 'morning')
      const eveningAvg = calculateShiftAverage(data, 'evening')
      return [
        { name: 'Morning', value: morningAvg },
        { name: 'Evening', value: eveningAvg }
      ]

    default:
      return data
  }
}

function calculateShiftAverage(data: ChartData[], shift: string) {
  const shiftData = data.filter(d => d.date.includes(shift))
  return shiftData.length > 0
    ? shiftData.reduce((sum, d) => sum + d.actual, 0) / shiftData.length
    : 0
}

function calculateAverage(data: ChartData[], key: keyof ChartData) {
  return data.length > 0
    ? data.reduce((sum, d) => sum + (d[key] || 0), 0) / data.length
    : 0
}

function calculateTrend(data: ChartData[]) {
  if (data.length < 2) return 0
  const last7Days = data.slice(-7)
  const previous7Days = data.slice(-14, -7)
  
  const last7Avg = calculateAverage(last7Days, 'actual')
  const previous7Avg = calculateAverage(previous7Days, 'actual')
  
  return previous7Avg ? ((last7Avg - previous7Avg) / previous7Avg) * 100 : 0
}

function StatCard({ title, value, unit, trend = false }: { title: string; value: number; unit: string; trend?: boolean }) {
  return (
    <div className="p-4 border rounded-lg">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className={`text-2xl font-bold ${trend && value < 0 ? 'text-red-500' : 'text-green-500'}`}>
        {value.toFixed(1)}{unit}
      </p>
    </div>
  )
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-60 mt-2" />
          </div>
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  )
}

