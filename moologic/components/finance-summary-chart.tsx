"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { useTheme } from "@/components/providers/theme-provider"
import { useTranslation } from "@/components/providers/language-provider"
import { useSession } from "next-auth/react"
import { useGetMonthlyFinanceSummaryQuery } from "@/components/finance-overview"

export function FinanceSummaryChart() {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ""

  const { data: monthlyData, isLoading } = useGetMonthlyFinanceSummaryQuery(accessToken)

  const textColor = theme === "dark" ? "#e5e7eb" : "#374151"
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb"

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">{t("Loading...")}</div>
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="month" tick={{ fill: textColor }} />
        <YAxis tick={{ fill: textColor }} tickFormatter={(value) => `${value / 1000}k`} />
        <Tooltip
          contentStyle={{
            backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
            borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
            color: textColor,
          }}
          formatter={(value) => [`${value.toLocaleString()}`, undefined]}
        />
        <Legend formatter={(value) => t(value)} />
        <Bar dataKey="income" name={t("Income")} fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" name={t("Expenses")} fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

