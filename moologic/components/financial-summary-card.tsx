"\"use client"

import { ArrowUp, ArrowDown } from "lucide-react"

export function FinancialSummaryCard({ title, value, change, trend, icon }) {
  return (
    <div className="p-4 rounded-md border shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="flex items-center text-sm mt-1">
        {trend === "up" && <ArrowUp className="h-4 w-4 text-green-500 mr-1" />}
        {trend === "down" && <ArrowDown className="h-4 w-4 text-red-500 mr-1" />}
        <span className={`${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500"}`}>
          {change}
        </span>
      </div>
    </div>
  )
}

