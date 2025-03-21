"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Bar,
  BarChart,
} from "recharts"
import { motion } from "framer-motion"
import { useState } from "react"

// Sample data for production trends
const monthlyProductionData = [
  { month: "Jan", production: 280000, target: 300000, farms: 350 },
  { month: "Feb", production: 320000, target: 300000, farms: 352 },
  { month: "Mar", production: 350000, target: 320000, farms: 355 },
  { month: "Apr", production: 340000, target: 320000, farms: 358 },
  { month: "May", production: 380000, target: 350000, farms: 360 },
  { month: "Jun", production: 420000, target: 350000, farms: 362 },
  { month: "Jul", production: 400000, target: 380000, farms: 365 },
  { month: "Aug", production: 380000, target: 380000, farms: 368 },
  { month: "Sep", production: 360000, target: 380000, farms: 370 },
  { month: "Oct", production: 340000, target: 350000, farms: 372 },
  { month: "Nov", production: 320000, target: 350000, farms: 375 },
  { month: "Dec", production: 300000, target: 320000, farms: 378 },
]

// Sample data for regional production
const regionalProductionData = [
  { region: "Addis Ababa", production: 42000, farms: 45 },
  { region: "Oromia", production: 127500, farms: 120 },
  { region: "Amhara", production: 93000, farms: 85 },
  { region: "Tigray", production: 31500, farms: 35 },
  { region: "SNNPR", production: 72000, farms: 65 },
]

// Sample data for production efficiency
const efficiencyData = [
  { year: "2020", efficiency: 78 },
  { year: "2021", efficiency: 82 },
  { year: "2022", efficiency: 85 },
  { year: "2023", efficiency: 88 },
  { year: "2024", efficiency: 92 },
]

export function ProductionTrends() {
  const [timeframe, setTimeframe] = useState("yearly")
  const [productionType, setProductionType] = useState("milk")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Production Trends</h2>
          <p className="text-gray-500 dark:text-gray-400">National milk production statistics</p>
        </div>

        <div className="flex gap-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>

          <Select value={productionType} onValueChange={setProductionType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="milk">Milk Production</SelectItem>
              <SelectItem value="beef">Beef Production</SelectItem>
              <SelectItem value="all">All Production</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle>National Production Trends</CardTitle>
              <CardDescription>Monthly milk production vs target (liters)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyProductionData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip formatter={(value) => [`${value.toLocaleString()} L`, undefined]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="production"
                      name="Actual Production"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      name="Target"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Regional Production Distribution</CardTitle>
              <CardDescription>Milk production by region (liters)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalProductionData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip formatter={(value) => [`${value.toLocaleString()} L`, undefined]} />
                    <Legend />
                    <Bar dataKey="production" name="Production" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Production Efficiency Trends</CardTitle>
              <CardDescription>Yearly efficiency improvements (%)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={efficiencyData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[70, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, "Efficiency"]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="efficiency"
                      name="Production Efficiency"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Farm Growth vs Production</CardTitle>
              <CardDescription>Correlation between number of farms and production</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyProductionData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" tickFormatter={(value) => `${value / 1000}k`} />
                    <YAxis yAxisId="right" orientation="right" domain={[340, 380]} />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "production") return [`${value.toLocaleString()} L`, "Production"]
                        return [value, "Farms"]
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="production"
                      name="Production"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="farms"
                      name="Number of Farms"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Key Production Insights</CardTitle>
            <CardDescription>Analysis of production trends and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                  <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">Positive Trends</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-green-700 dark:text-green-400">
                    <li>Overall production increased by 12.3% year-over-year</li>
                    <li>Production efficiency improved from 88% to 92%</li>
                    <li>Oromia region showed the highest growth at 15.2%</li>
                    <li>Number of registered farms increased by 8.5%</li>
                  </ul>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg">
                  <h3 className="font-medium text-amber-800 dark:text-amber-300 mb-2">Areas for Improvement</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-amber-700 dark:text-amber-400">
                    <li>Production in Tigray region is 5% below target</li>
                    <li>Q4 production shows seasonal decline</li>
                    <li>Small farms {"<"} 50 cattle show lower efficiency</li>
                    <li>Feed cost increases affecting production margins</li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Recommendations</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 dark:text-blue-400">
                    <li>Increase technical support to Tigray region</li>
                    <li>Implement winter feeding programs to reduce seasonal decline</li>
                    <li>Provide efficiency training for small farm operators</li>
                    <li>Explore feed subsidy programs to offset rising costs</li>
                  </ul>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="font-medium mb-2">Production Forecast</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Based on current trends, we project a 10-15% increase in national milk production for the coming year,
                  with the highest growth expected in Oromia and Amhara regions. Efficiency improvements are expected to
                  continue, potentially reaching 95% by year-end with proper implementation of recommended programs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

