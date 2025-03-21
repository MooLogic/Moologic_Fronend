"use client"

import { Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, Line, ComposedChart } from "recharts"
import { useTheme } from "@/components/providers/theme-provider"
import { useTranslation } from "@/components/providers/language-provider"

// Sample data for production trend
const trendData = [
  { month: "Jan", morning: 12, evening: 10, average: 11 },
  { month: "Feb", morning: 13, evening: 11, average: 12 },
  { month: "Mar", morning: 15, evening: 12, average: 13.5 },
  { month: "Apr", morning: 14, evening: 11, average: 12.5 },
  { month: "May", morning: 13, evening: 10, average: 11.5 },
  { month: "Jun", morning: 12, evening: 9, average: 10.5 },
  { month: "Jul", morning: 11, evening: 9, average: 10 },
  { month: "Aug", morning: 12, evening: 10, average: 11 },
  { month: "Sep", morning: 13, evening: 11, average: 12 },
  { month: "Oct", morning: 14, evening: 12, average: 13 },
  { month: "Nov", morning: 15, evening: 13, average: 14 },
  { month: "Dec", morning: 14, evening: 12, average: 13 },
]

export function MilkProductionTrendChart() {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const textColor = theme === "dark" ? "#e5e7eb" : "#374151"
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="month" tick={{ fill: textColor }} />
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
        />
        <Legend formatter={(value) => t(value)} />
        <Bar dataKey="morning" name={t("Morning")} stackId="a" fill="#6366f1" radius={[4, 4, 0, 0]} />
        <Bar dataKey="evening" name={t("Evening")} stackId="a" fill="#a5b4fc" radius={[4, 4, 0, 0]} />
        <Line type="monotone" dataKey="average" name={t("Average")} stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

