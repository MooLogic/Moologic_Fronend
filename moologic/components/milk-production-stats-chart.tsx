"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useTheme } from "@/components/providers/theme-provider"
import { useMobile } from "@/hooks/use-mobile"

const data = [
  { month: "Jan", production: 68500, quality: 95 },
  { month: "Feb", production: 65200, quality: 94 },
  { month: "Mar", production: 72300, quality: 96 },
  { month: "Apr", production: 70100, quality: 93 },
  { month: "May", production: 74500, quality: 97 },
  { month: "Jun", production: 71200, quality: 95 },
  { month: "Jul", production: 69800, quality: 94 },
  { month: "Aug", production: 67300, quality: 92 },
  { month: "Sep", production: 70500, quality: 93 },
  { month: "Oct", production: 72450, quality: 96 },
  { month: "Nov", production: 69700, quality: 94 },
  { month: "Dec", production: 68900, quality: 93 },
]

export function MilkProductionStatsChart() {
  const { theme } = useTheme()
  const isMobile = useMobile()
  const [chartData, setChartData] = useState(data)

  useEffect(() => {
    // For mobile, reduce the number of data points to avoid overcrowding
    if (isMobile) {
      const reducedData = data.filter((_, index) => index % 2 === 0 || index === data.length - 1)
      setChartData(reducedData)
    } else {
      setChartData(data)
    }
  }, [isMobile])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: isMobile ? 0 : 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={!isMobile} />
        <XAxis
          dataKey="month"
          tick={{ fill: theme === "dark" ? "#ccc" : "#666", fontSize: isMobile ? 10 : 12 }}
          interval={isMobile ? 1 : 0}
        />
        <YAxis
          yAxisId="left"
          orientation="left"
          stroke="#6366f1"
          tick={{ fill: theme === "dark" ? "#ccc" : "#666", fontSize: isMobile ? 10 : 12 }}
          width={isMobile ? 30 : 40}
          tickFormatter={(value) => (isMobile ? `${value / 1000}k` : value)}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="#22c55e"
          tick={{ fill: theme === "dark" ? "#ccc" : "#666", fontSize: isMobile ? 10 : 12 }}
          width={isMobile ? 30 : 40}
          domain={[80, 100]}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white dark:bg-gray-800 p-2 border rounded-lg shadow-lg">
                  <p className="text-sm font-medium">{payload[0].payload.month}</p>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400">
                    Production: {payload[0].value.toLocaleString()} liters
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">Quality Score: {payload[1].value}/100</p>
                </div>
              )
            }
            return null
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: isMobile ? 10 : 12 }}
          formatter={(value) => <span className="text-gray-600 dark:text-gray-300">{value}</span>}
        />
        <Bar yAxisId="left" dataKey="production" name="Milk Production (liters)" fill="#6366f1" radius={[4, 4, 0, 0]} />
        <Bar yAxisId="right" dataKey="quality" name="Quality Score" fill="#22c55e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

