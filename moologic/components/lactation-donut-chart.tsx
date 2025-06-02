"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useMobile } from "@/hooks/use-mobile"

interface LactationData {
  [key: string]: number;
}

interface LactationDonutChartProps {
  data?: LactationData;
}

const COLORS = {
  early: '#2563eb',  // Blue
  mid: '#16a34a',    // Green
  late: '#dc2626'    // Red
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  value,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function LactationDonutChart({ data }: LactationDonutChartProps) {
  const [chartLoaded, setChartLoaded] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    const timer = setTimeout(() => {
      setChartLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  const chartData = Object.entries(data).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }))

  return (
    <div className="h-[300px] w-full flex flex-col items-center justify-center">
      <div className="relative h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius="80%"
              innerRadius="60%"
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value} cattle`, 'Count']}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <Legend 
              formatter={(value: string) => value + ' Lactation'} 
              verticalAlign="bottom" 
              height={36}
            />
          </PieChart>
        </ResponsiveContainer>

        <motion.div
          className="absolute inset-0 flex items-center justify-center flex-col"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: chartLoaded ? 1 : 0, scale: chartLoaded ? 1 : 0.8 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className={`${isMobile ? "text-3xl" : "text-4xl"} font-bold`}>80%</div>
          <div className="text-sm text-gray-500">Lactating</div>
        </motion.div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-4">
        {chartData.map((item, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
          >
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[item.name.toLowerCase() as keyof typeof COLORS] }} />
            <span className="text-sm text-gray-600 dark:text-gray-300">{item.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

