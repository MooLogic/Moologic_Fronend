"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useTheme } from "@/components/providers/theme-provider"
import { useTranslation } from "@/components/providers/language-provider"

// Sample data for income categories
const incomeCategoryData = [
  { name: "Milk Sales", value: 85000 },
  { name: "Cattle Sales", value: 25000 },
  { name: "Manure", value: 8000 },
  { name: "Government Subsidies", value: 5000 },
  { name: "Other", value: 2000 },
]

const COLORS = ["#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9"]

export function IncomeCategoryChart() {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const textColor = theme === "dark" ? "#e5e7eb" : "#374151"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <Pie
          data={incomeCategoryData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          innerRadius={60}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${t(name)}: ${(percent * 100).toFixed(0)}%`}
        >
          {incomeCategoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
            borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
            color: textColor,
          }}
          formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
          labelFormatter={(value) => t(value)}
        />
        <Legend formatter={(value) => t(value)} layout="vertical" verticalAlign="middle" align="right" />
      </PieChart>
    </ResponsiveContainer>
  )
}

