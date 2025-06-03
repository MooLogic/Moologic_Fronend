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
} from "recharts"

interface LactationCurveData {
  day: number
  expected: number
  actual: number | null
}

interface LactationCurveChartProps {
  data: LactationCurveData[]
}

export function LactationCurveChart({ data }: LactationCurveChartProps) {
  const { theme } = useTheme()
  const { t } = useTranslation()

  // Calculate statistics
  const actualData = data.filter(d => d.actual !== null)
  const peakDay = actualData.reduce((max, curr) => 
    (curr.actual || 0) > (actualData[max].actual || 0) ? curr.day : max
  , 0)
  
  const peakProduction = actualData[peakDay]?.actual || 0
  const persistency = actualData.length > 0 
    ? ((actualData[actualData.length - 1]?.actual || 0) / peakProduction) * 100 
    : 0

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-3 bg-white dark:bg-gray-800 shadow-lg">
          <p className="text-sm font-medium">{t("Day")}: {label}</p>
          {payload.map((entry: any) => (
            <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
              {entry.name === "expected" ? t("Expected") : t("Actual")}: {entry.value?.toFixed(1)} L
            </p>
          ))}
        </Card>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">{t("Peak Day")}</p>
          <p className="text-2xl font-bold">{peakDay}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">{t("Peak Production")}</p>
          <p className="text-2xl font-bold">{peakProduction.toFixed(1)} L</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">{t("Persistency")}</p>
          <p className="text-2xl font-bold">{persistency.toFixed(1)}%</p>
        </Card>
      </div>
      
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="day"
            label={{ value: t("Days in Milk"), position: "insideBottom", offset: -5 }}
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
        <Line
          type="monotone"
            dataKey="expected"
            stroke="#8884d8"
            name={t("Expected (Woods Model)")}
          strokeWidth={2}
            dot={false}
        />
        <Line
          type="monotone"
            dataKey="actual"
            stroke="#82ca9d"
            name={t("Actual Production")}
          strokeWidth={2}
            connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
    </div>
  )
}

