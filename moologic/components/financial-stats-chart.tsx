"use client"

import { Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, Line, ComposedChart } from "recharts"
import { useTheme } from "@/components/providers/theme-provider"
import { useTranslation } from "@/components/providers/language-provider"

// Sample data for financial statistics
const financialData = [
  { month: "Jan", revenue: 9500, expenses: 7200, profit: 2300, profitMargin: 24.2 },
  { month: "Feb", revenue: 10200, expenses: 7800, profit: 2400, profitMargin: 23.5 },
  { month: "Mar", revenue: 11000, expenses: 8100, profit: 2900, profitMargin: 26.4 },
  { month: "Apr", revenue: 10800, expenses: 7900, profit: 2900, profitMargin: 26.9 },
  { month: "May", revenue: 11500, expenses: 8300, profit: 3200, profitMargin: 27.8 },
  { month: "Jun", revenue: 12000, expenses: 8500, profit: 3500, profitMargin: 29.2 },
  { month: "Jul", revenue: 11800, expenses: 8200, profit: 3600, profitMargin: 30.5 },
  { month: "Aug", revenue: 12200, expenses: 8600, profit: 3600, profitMargin: 29.5 },
  { month: "Sep", revenue: 12500, expenses: 8800, profit: 3700, profitMargin: 29.6 },
  { month: "Oct", revenue: 11900, expenses: 8400, profit: 3500, profitMargin: 29.4 },
  { month: "Nov", revenue: 11200, expenses: 8000, profit: 3200, profitMargin: 28.6 },
  { month: "Dec", revenue: 10800, expenses: 7700, profit: 3100, profitMargin: 28.7 },
]

export function FinancialStatsChart() {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const textColor = theme === "dark" ? "#e5e7eb" : "#374151"
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={financialData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="month" tick={{ fill: textColor }} />
        <YAxis
          yAxisId="left"
          label={{
            value: t("Amount ($)"),
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
            value: t("Profit Margin (%)"),
            angle: 90,
            position: "insideRight",
            fill: textColor,
          }}
          tick={{ fill: textColor }}
          domain={[0, 40]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
            borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
            color: textColor,
          }}
          formatter={(value, name) => {
            if (name === "profitMargin") return [`${value}%`, t("Profit Margin")]
            return [`$${value.toLocaleString()}`, t(name.charAt(0).toUpperCase() + name.slice(1))]
          }}
        />
        <Legend
          formatter={(value) => {
            if (value === "revenue") return t("Revenue")
            if (value === "expenses") return t("Expenses")
            if (value === "profit") return t("Profit")
            if (value === "profitMargin") return t("Profit Margin")
            return value
          }}
        />
        <Area yAxisId="left" type="monotone" dataKey="revenue" fill="#6366f1" stroke="#6366f1" fillOpacity={0.3} />
        <Area yAxisId="left" type="monotone" dataKey="expenses" fill="#ef4444" stroke="#ef4444" fillOpacity={0.3} />
        <Area yAxisId="left" type="monotone" dataKey="profit" fill="#22c55e" stroke="#22c55e" fillOpacity={0.3} />
        <Line yAxisId="right" type="monotone" dataKey="profitMargin" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

