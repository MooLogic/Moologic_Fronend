"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { useTheme } from "@/components/providers/theme-provider"
import { useTranslation } from "@/components/providers/language-provider"

// Sample data for finance summary
const financeSummaryData = [
  { month: "Jan", income: 9500, expenses: 7200 },
  { month: "Feb", income: 10200, expenses: 7800 },
  { month: "Mar", income: 11000, expenses: 8100 },
  { month: "Apr", income: 10800, expenses: 7900 },
  { month: "May", income: 11500, expenses: 8300 },
  { month: "Jun", income: 12000, expenses: 8500 },
  { month: "Jul", income: 11800, expenses: 8200 },
  { month: "Aug", income: 12200, expenses: 8600 },
  { month: "Sep", income: 12500, expenses: 8800 },
  { month: "Oct", income: 11900, expenses: 8400 },
  { month: "Nov", income: 11200, expenses: 8000 },
  { month: "Dec", income: 10800, expenses: 7700 },
]

export function FinanceSummaryChart() {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const textColor = theme === "dark" ? "#e5e7eb" : "#374151"
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={financeSummaryData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="month" tick={{ fill: textColor }} />
        <YAxis tick={{ fill: textColor }} tickFormatter={(value) => `$${value / 1000}k`} />
        <Tooltip
          contentStyle={{
            backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
            borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
            color: textColor,
          }}
          formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
        />
        <Legend formatter={(value) => t(value)} />
        <Bar dataKey="income" name={t("Income")} fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" name={t("Expenses")} fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

