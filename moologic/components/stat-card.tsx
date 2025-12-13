"use client"

// framer-motion removed — use CSS utilities for entrance and hover interactions
import { Card, CardContent } from "@/components/ui/card"

export function StatCard({ icon, value, label, bgColor, delay = 0 }) {
  return (
    <div className="fade-in hover-raise">
      <Card className="overflow-hidden">
        <CardContent className="p-6 flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center`}>{icon}</div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-800">{value}</span>
            <span className="text-sm text-gray-500">{label}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

