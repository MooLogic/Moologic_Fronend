"use client"

import { motion } from "framer-motion"

// Define a type for the cow object
type Cow = {
  id: string
  avgProduction: string
}

// Add default empty array for cows prop
export function TopCows({ cows = [] }: { cows?: Cow[] }) {
  return (
    <div className="space-y-4">
      {/* Add a check to ensure cows exists before mapping */}
      {cows && cows.length > 0 ? (
        cows.map((cow, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.2 }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2 },
            }}
          >
            <div className="w-16 h-16 rounded-lg overflow-hidden">
              <img src="/placeholder.svg?height=64&width=64" alt="Cow" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-medium">{cow.id}</div>
              <div className="text-sm text-gray-500">{cow.avgProduction}</div>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-4 text-gray-500">No top performing cows to display</div>
      )}
    </div>
  )
}

