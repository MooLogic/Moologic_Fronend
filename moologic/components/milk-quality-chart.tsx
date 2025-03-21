"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { useTheme } from "@/components/providers/theme-provider"
import { useTranslation } from "@/components/providers/language-provider"

// Sample data for milk quality
const qualityData = [
  { month: "Jan", fat: 3.7, protein: 3.1, lactose: 4.5 },
  { month: "Feb", fat: 3.8, protein: 3.2, lactose: 4.6 },
  { month: "Mar", fat: 3.9, protein: 3.3, lactose: 4.7 },
  { month: "Apr", fat: 3.8, protein: 3.2, lactose: 4.6 },
  { month: "May", fat: 3.7, protein: 3.1, lactose: 4.5 },
  { month: "Jun", fat: 3.6, protein: 3.0, lactose: 4.4 },
  { month: "Jul", fat: 3.5, protein: 2.9, lactose: 4.3 },
  { month: "Aug", fat: 3.6, protein: 3.0, lactose: 4.4 },
  { month: "Sep", fat: 3.7, protein: 3.1, lactose: 4.5 },
  { month: "Oct", fat: 3.8, protein: 3.2, lactose: 4.6 },
  { month: "Nov", fat: 3.9, protein: 3.3, lactose: 4.7 },
  { month: "Dec", fat: 3.8, protein: 3.2, lactose: 4.6 },
]

export function MilkQualityChart() {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const textColor = theme === "dark" ? "#e5e7eb" : "#374151"
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={qualityData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
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
        <Legend formatter={(value) => t(value)} />
        <Line type="monotone" dataKey="fat" name={t("Fat")} stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="protein" name={t("Protein")} stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="lactose" name={t("Lactose")} stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

