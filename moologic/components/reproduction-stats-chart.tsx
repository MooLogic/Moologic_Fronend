"use client"

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts"
import { useTheme } from "@/components/providers/theme-provider"
import { useTranslation } from "@/components/providers/language-provider"

// Sample data for reproduction statistics
const reproductionData = [
  { month: "Jan", pregnancyRate: 38, conceptionRate: 42, calvingRate: 90 },
  { month: "Feb", pregnancyRate: 39, conceptionRate: 43, calvingRate: 91 },
  { month: "Mar", pregnancyRate: 40, conceptionRate: 44, calvingRate: 92 },
  { month: "Apr", pregnancyRate: 41, conceptionRate: 45, calvingRate: 92 },
  { month: "May", pregnancyRate: 42, conceptionRate: 46, calvingRate: 93 },
  { month: "Jun", pregnancyRate: 43, conceptionRate: 47, calvingRate: 93 },
  { month: "Jul", pregnancyRate: 42, conceptionRate: 46, calvingRate: 92 },
  { month: "Aug", pregnancyRate: 41, conceptionRate: 45, calvingRate: 91 },
  { month: "Sep", pregnancyRate: 40, conceptionRate: 44, calvingRate: 90 },
  { month: "Oct", pregnancyRate: 41, conceptionRate: 45, calvingRate: 91 },
  { month: "Nov", pregnancyRate: 42, conceptionRate: 46, calvingRate: 92 },
  { month: "Dec", pregnancyRate: 43, conceptionRate: 47, calvingRate: 93 },
]

export function ReproductionStatsChart() {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const textColor = theme === "dark" ? "#e5e7eb" : "#374151"
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={reproductionData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="month" tick={{ fill: textColor }} />
        <YAxis
          label={{
            value: t("Percentage (%)"),
            angle: -90,
            position: "insideLeft",
            fill: textColor,
          }}
          tick={{ fill: textColor }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
            borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
            color: textColor,
          }}
          formatter={(value) => [`${value}%`, undefined]}
        />
        <Legend
          formatter={(value) => {
            if (value === "pregnancyRate") return t("Pregnancy Rate")
            if (value === "conceptionRate") return t("Conception Rate")
            if (value === "calvingRate") return t("Calving Rate")
            return value
          }}
        />
        <ReferenceLine
          y={45}
          stroke="#ef4444"
          strokeDasharray="3 3"
          label={{ value: t("Target"), fill: textColor, position: "right" }}
        />
        <Line
          type="monotone"
          dataKey="pregnancyRate"
          name="pregnancyRate"
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="conceptionRate"
          name="conceptionRate"
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="calvingRate"
          name="calvingRate"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

