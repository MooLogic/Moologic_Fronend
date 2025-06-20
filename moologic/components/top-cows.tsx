"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

// Define a type for the cow object
interface Cow {
  id: string;
  ear_tag_no: string;
  totalProduction: number;
  recordCount: number;
  averageProduction: number;
}

interface TopCowsProps {
  data: Cow[];
}

// Add default empty array for cows prop
export function TopCows({ data }: TopCowsProps) {
  const router = useRouter()

  return (
    <div className="space-y-4">
      {/* Add a check to ensure cows exists before mapping */}
      {data && data.length > 0 ? (
        data.map((cow, index) => (
          <motion.div
            key={index}
            className="flex items-center justify-between gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.2 }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2 },
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden">
                <img src="/placeholder.svg?height=64&width=64" alt="Cow" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-medium">{cow.ear_tag_no}</div>
                <div className="text-sm text-gray-500">{cow.averageProduction.toFixed(2)} L/day</div>
              </div>
            </div>
            <Button variant="link" className="text-indigo-600 hover:text-indigo-700" onClick={() => router.push(`/milk-yield/cattle/${cow.id}`)}>
              Detail
            </Button>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-4 text-gray-500">No top performing cows to display</div>
      )}
    </div>
  )
}

