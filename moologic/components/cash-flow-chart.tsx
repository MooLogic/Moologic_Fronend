"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { useTheme } from "@/components/providers/theme-provider"
import { useTranslation } from "@/components/providers/language-provider"

// Sample data for cash flow
const cashFlowData = [
  { month: "Jan", cashFlow: 2300 },
  { month: "Feb", cashFlow: 2400 },
  { month: "Mar", cashFlow: 2900 },
  { month: "Apr", cashFlow: 2900 },
  { month: "May", cashFlow: 3200 },
  { month: "Jun", cashFlow: 3500 },
  { month: "Jul", cashFlow: 3600 },
  { month: "Aug", cashFlow: 3600 },
  { month: "Sep", cashFlow: 3700 },
  { month: "Oct", cashFlow: 3500 },
  { month: "Nov", cashFlow: 3200 },
  { month: "Dec", cashFlow: 3100 },
]

export function CashFlowChart() {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const textColor = theme === "dark" ? "#e5e7eb" : "#374151"
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={cashFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
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
        <Area
          type="monotone"
          dataKey="cashFlow"
          name={t("Cash Flow")}
          stroke="#6366f1"
          fill="#a5b4fc"
          fillOpacity={0.6}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

