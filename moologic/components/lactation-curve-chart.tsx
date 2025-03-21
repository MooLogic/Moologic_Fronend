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

// Sample data for lactation curve
const lactationData = [
  { day: 0, actual: 15, expected: 15 },
  { day: 30, actual: 25, expected: 28 },
  { day: 60, actual: 30, expected: 32 },
  { day: 90, actual: 32, expected: 30 },
  { day: 120, actual: 28, expected: 28 },
  { day: 150, actual: 25, expected: 26 },
  { day: 180, actual: 22, expected: 24 },
  { day: 210, actual: 20, expected: 22 },
  { day: 240, actual: 18, expected: 20 },
  { day: 270, actual: 15, expected: 18 },
  { day: 300, actual: 12, expected: 15 },
  { day: 330, actual: 8, expected: 12 },
  { day: 360, actual: 5, expected: 8 },
]

export function LactationCurveChart() {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const textColor = theme === "dark" ? "#e5e7eb" : "#374151"
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={lactationData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey="day"
          label={{
            value: t("Days in Milk"),
            position: "insideBottomRight",
            offset: -10,
            fill: textColor,
          }}
          tick={{ fill: textColor }}
        />
        <YAxis
          label={{
            value: t("Milk Yield (L)"),
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
          formatter={(value) => [`${value} L`, undefined]}
          labelFormatter={(value) => `${t("Day")} ${value}`}
        />
        <Legend formatter={(value) => t(value)} />
        <ReferenceLine x={90} stroke="#ff7f50" strokeDasharray="3 3" label={{ value: t("Peak"), fill: textColor }} />
        <Line
          type="monotone"
          dataKey="actual"
          name={t("Actual")}
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="expected"
          name={t("Expected")}
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ r: 4 }}
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

