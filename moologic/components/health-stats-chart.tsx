"use client"

import { Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, Line, ComposedChart } from "recharts"
import { useTheme } from "@/components/providers/theme-provider"
import { useTranslation } from "@/components/providers/language-provider"

// Sample data for health statistics
const healthData = [
  { month: "Jan", mastitis: 3, lameness: 2, respiratory: 1, metabolic: 1, recoveryRate: 92 },
  { month: "Feb", mastitis: 2, lameness: 3, respiratory: 1, metabolic: 0, recoveryRate: 93 },
  { month: "Mar", mastitis: 2, lameness: 2, respiratory: 0, metabolic: 1, recoveryRate: 94 },
  { month: "Apr", mastitis: 1, lameness: 1, respiratory: 1, metabolic: 0, recoveryRate: 95 },
  { month: "May", mastitis: 1, lameness: 2, respiratory: 0, metabolic: 0, recoveryRate: 96 },
  { month: "Jun", mastitis: 2, lameness: 1, respiratory: 0, metabolic: 1, recoveryRate: 95 },
  { month: "Jul", mastitis: 3, lameness: 1, respiratory: 1, metabolic: 0, recoveryRate: 94 },
  { month: "Aug", mastitis: 2, lameness: 2, respiratory: 0, metabolic: 0, recoveryRate: 93 },
  { month: "Sep", mastitis: 1, lameness: 1, respiratory: 1, metabolic: 1, recoveryRate: 92 },
  { month: "Oct", mastitis: 2, lameness: 0, respiratory: 1, metabolic: 0, recoveryRate: 93 },
  { month: "Nov", mastitis: 1, lameness: 1, respiratory: 0, metabolic: 1, recoveryRate: 94 },
  { month: "Dec", mastitis: 2, lameness: 1, respiratory: 0, metabolic: 0, recoveryRate: 95 },
]

export function HealthStatsChart() {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const textColor = theme === "dark" ? "#e5e7eb" : "#374151"
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={healthData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="month" tick={{ fill: textColor }} />
        <YAxis
          yAxisId="left"
          label={{
            value: t("Number of Cases"),
            angle: -90,
            position: "insideLeft",
            fill: textColor,
          }}
          tick={{ fill: textColor }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          label={{
            value: t("Recovery Rate (%)"),
            angle: 90,
            position: "insideRight",
            fill: textColor,
          }}
          tick={{ fill: textColor }}
          domain={[80, 100]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
            borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
            color: textColor,
          }}
          formatter={(value, name) => {
            if (name === "recoveryRate") return [`${value}%`, t("Recovery Rate")]
            return [value, t(name.charAt(0).toUpperCase() + name.slice(1))]
          }}
        />
        <Legend
          formatter={(value) => {
            if (value === "mastitis") return t("Mastitis")
            if (value === "lameness") return t("Lameness")
            if (value === "respiratory") return t("Respiratory")
            if (value === "metabolic") return t("Metabolic")
            if (value === "recoveryRate") return t("Recovery Rate")
            return value
          }}
        />
        <Bar yAxisId="left" dataKey="mastitis" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
        <Bar yAxisId="left" dataKey="lameness" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
        <Bar yAxisId="left" dataKey="respiratory" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
        <Bar yAxisId="left" dataKey="metabolic" stackId="a" fill="#8b5cf6" radius={[0, 0, 0, 0]} />
        <Line yAxisId="right" type="monotone" dataKey="recoveryRate" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

