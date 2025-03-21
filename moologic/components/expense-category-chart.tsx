"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useTheme } from "@/components/providers/theme-provider"
import { useTranslation } from "@/components/providers/language-provider"

// Sample data for expense categories
const expenseCategoryData = [
  { name: "Feed", value: 35000 },
  { name: "Labor", value: 20000 },
  { name: "Veterinary", value: 8000 },
  { name: "Equipment", value: 7000 },
  { name: "Utilities", value: 6000 },
  { name: "Maintenance", value: 5000 },
  { name: "Other", value: 4000 },
]

const COLORS = ["#6366f1", "#8b5cf6", "#d946ef", "#ec4899", "#f43f5e", "#f97316", "#eab308"]

export function ExpenseCategoryChart() {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const textColor = theme === "dark" ? "#e5e7eb" : "#374151"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <Pie
          data={expenseCategoryData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          innerRadius={60}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${t(name)}: ${(percent * 100).toFixed(0)}%`}
        >
          {expenseCategoryData.map((entry, index) => (
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

