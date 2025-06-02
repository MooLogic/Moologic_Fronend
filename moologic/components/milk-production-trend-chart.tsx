"use client"

import { useTheme } from "@/components/providers/theme-provider"
import { Card } from "@/components/ui/card"
import { useTranslation } from "@/components/providers/language-provider"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts"
import { format, subDays } from "date-fns"

interface MilkRecord {
  id: number
  quantity: number
  date: string
  shift: "morning" | "evening"
}

interface MilkProductionTrendChartProps {
  data: MilkRecord[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  const { t } = useTranslation()
  if (active && payload && payload.length) {
    return (
      <Card className="p-3 bg-white shadow-lg">
        <p className="text-sm font-medium mb-2">
          {format(new Date(label), "MMM d, yyyy")}
        </p>
        {payload.map((entry: any) => (
          <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
            {t(entry.name)}: {Number(entry.value || 0).toFixed(1)} L
          </p>
        ))}
      </Card>
    )
  }
  return null
}

export function MilkProductionTrendChart({ data }: MilkProductionTrendChartProps) {
  const { theme } = useTheme()
  const { t } = useTranslation()

  // Process data to group by date and shift
  const processedData = data.reduce((acc: any[], record) => {
    const date = record.date.split('T')[0]
    const existingRecord = acc.find(r => r.date === date)

    if (existingRecord) {
      if (record.shift === 'morning') {
        existingRecord.morning = Number(record.quantity) || 0
      } else {
        existingRecord.evening = Number(record.quantity) || 0
      }
      existingRecord.total = Number(existingRecord.morning + existingRecord.evening)
    } else {
      acc.push({
        date,
        morning: record.shift === 'morning' ? Number(record.quantity) || 0 : 0,
        evening: record.shift === 'evening' ? Number(record.quantity) || 0 : 0,
        total: Number(record.quantity) || 0
      })
    }

    return acc
  }, [])

  // Sort by date
  processedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Calculate 7-day moving average
  processedData.forEach((day, index) => {
    const last7Days = processedData.slice(Math.max(0, index - 6), index + 1)
    day.average = last7Days.reduce((sum, d) => sum + d.total, 0) / last7Days.length
  })

  // Calculate statistics
  const currentAverage = processedData[processedData.length - 1]?.average || 0
  const previousAverage = processedData[processedData.length - 8]?.average || 0
  const trend = previousAverage ? ((currentAverage - previousAverage) / previousAverage) * 100 : 0

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">{t("Current Average")}</p>
          <p className="text-2xl font-bold">{currentAverage.toFixed(1)} L</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">{t("Previous Average")}</p>
          <p className="text-2xl font-bold">{previousAverage.toFixed(1)} L</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">{t("7-Day Trend")}</p>
          <p className={`text-2xl font-bold ${trend > 0 ? "text-green-500" : "text-red-500"}`}>
            {trend > 0 ? "+" : ""}{trend.toFixed(1)}%
          </p>
        </Card>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => format(new Date(value), "MMM d")}
            label={{ value: t("Date"), position: "insideBottom", offset: -5 }}
          />
          <YAxis
            label={{
              value: t("Daily Milk Yield (L)"),
              angle: -90,
              position: "insideLeft",
              offset: 10,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="morning"
            stackId="1"
            stroke="#8884d8"
            fill="#8884d8"
            name={t("Morning")}
            fillOpacity={0.3}
          />
          <Area
            type="monotone"
            dataKey="evening"
            stackId="1"
            stroke="#82ca9d"
            fill="#82ca9d"
            name={t("Evening")}
            fillOpacity={0.3}
          />
          <Line
            type="monotone"
            dataKey="average"
            stroke="#ff7300"
            name={t("7-Day Average")}
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

