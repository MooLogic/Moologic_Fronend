"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { useMobile } from "@/hooks/use-mobile"

const data = [
  { name: "Lactating", value: 80, color: "#4f86f7" },
  { name: "Prelactating", value: 10, color: "#ffd700" },
  { name: "Postlactating", value: 10, color: "#ff7f50" },
]

export function LactationDonutChart() {
  const [chartLoaded, setChartLoaded] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    const timer = setTimeout(() => {
      setChartLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="h-[300px] w-full flex flex-col items-center justify-center">
      <div className="relative h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={isMobile ? 40 : 60}
              outerRadius={isMobile ? 60 : 80}
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-in-out"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
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
        {data.map((item, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
          >
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-gray-600 dark:text-gray-300">{item.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

