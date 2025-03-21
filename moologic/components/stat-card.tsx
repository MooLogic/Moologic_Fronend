"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export function StatCard({ icon, value, label, bgColor, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6 flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center`}>{icon}</div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-800">{value}</span>
            <span className="text-sm text-gray-500">{label}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

