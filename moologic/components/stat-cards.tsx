"use client"

import { motion } from "framer-motion"
import { Box, Milk, Circle, Activity } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function StatCards() {
  const stats = [
    {
      icon: <Box className="h-6 w-6 text-indigo-500" />,
      value: "234",
      label: "Total Animal",
      bgColor: "bg-indigo-50",
      delay: 0.1,
    },
    {
      icon: <Milk className="h-6 w-6 text-amber-500" />,
      value: "123",
      label: "Lactating",
      bgColor: "bg-amber-50",
      delay: 0.2,
    },
    {
      icon: <Circle className="h-6 w-6 text-indigo-500" />,
      value: "32",
      label: "Pregnant",
      bgColor: "bg-indigo-50",
      delay: 0.3,
    },
    {
      icon: <Activity className="h-6 w-6 text-indigo-500" />,
      value: "19.2",
      label: "Average daily/cow",
      bgColor: "bg-indigo-50",
      delay: 0.4,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: stat.delay }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-6 flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                <span className="text-sm text-gray-500">{stat.label}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

