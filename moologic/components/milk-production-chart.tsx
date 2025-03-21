"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useTheme } from "@/components/providers/theme-provider"
import { useMobile } from "@/hooks/use-mobile"

const data = [
  { time: "10am", ideal: 280, current: 260 },
  { time: "11am", ideal: 170, current: 150 },
  { time: "12pm", ideal: 190, current: 180 },
  { time: "01am", ideal: 240, current: 220 },
  { time: "02am", ideal: 278, current: 278, name: "Jiangyu" },
  { time: "03am", ideal: 190, current: 170 },
  { time: "04am", ideal: 190, current: 90 },
  { time: "05am", ideal: 180, current: 160 },
  { time: "06am", ideal: 220, current: 200 },
  { time: "07am", ideal: 290, current: 270 },
]

export function MilkProductionChart() {
  const { theme } = useTheme()
  const isMobile = useMobile()
  const [chartData, setChartData] = useState(data)

  useEffect(() => {
    // For mobile, reduce the number of data points to avoid overcrowding
    if (isMobile) {
      const reducedData = data.filter((_, index) => index % 2 === 0)
      setChartData(reducedData)
    } else {
      setChartData(data)
    }
  }, [isMobile])

  return (
    <div className="h-[300px] w-full">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-indigo-500" />
          <span className="text-sm">Ideal Production</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span className="text-sm">Current Production</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: isMobile ? -20 : 0, bottom: 5 }}>
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: theme === "dark" ? "#888" : "#888", fontSize: isMobile ? 10 : 12 }}
            interval={isMobile ? 1 : 0}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: theme === "dark" ? "#888" : "#888", fontSize: isMobile ? 10 : 12 }}
            domain={[0, 500]}
            ticks={[0, 100, 200, 300, 400, 500]}
            width={isMobile ? 30 : 40}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-white dark:bg-gray-800 p-2 border rounded-lg shadow-lg">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{data.time}</div>
                    <div className="font-medium">
                      {data.name && <div className="text-sm mb-1">Full Name: {data.name}</div>}
                      <div className="text-indigo-600 dark:text-indigo-400">Ideal: {data.ideal} Ltrs</div>
                      <div className="text-green-600 dark:text-green-400">Current: {data.current} Ltrs</div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="ideal"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: isMobile ? 4 : 6 }}
          />
          <Line
            type="monotone"
            dataKey="current"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: isMobile ? 4 : 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

