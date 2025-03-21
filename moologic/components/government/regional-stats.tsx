"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Line,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { motion } from "framer-motion"
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react"

// Sample data for regional statistics
const regionalData = [
  { region: "Addis Ababa", farms: 45, cattle: 2800, production: 42000, disease: 12 },
  { region: "Oromia", farms: 120, cattle: 8500, production: 127500, disease: 28 },
  { region: "Amhara", farms: 85, cattle: 6200, production: 93000, disease: 18 },
  { region: "Tigray", farms: 35, cattle: 2100, production: 31500, disease: 8 },
  { region: "SNNPR", farms: 65, cattle: 4800, production: 72000, disease: 15 },
]

// Sample data for farm types
const farmTypeData = [
  { name: "Dairy", value: 210 },
  { name: "Mixed", value: 85 },
  { name: "Beef", value: 55 },
]

// Sample data for monthly production
const monthlyProductionData = [
  { month: "Jan", production: 28000, target: 30000 },
  { month: "Feb", production: 32000, target: 30000 },
  { month: "Mar", production: 35000, target: 32000 },
  { month: "Apr", production: 34000, target: 32000 },
  { month: "May", production: 38000, target: 35000 },
  { month: "Jun", production: 42000, target: 35000 },
  { month: "Jul", production: 40000, target: 38000 },
  { month: "Aug", production: 38000, target: 38000 },
  { month: "Sep", production: 36000, target: 38000 },
  { month: "Oct", production: 34000, target: 35000 },
  { month: "Nov", production: 32000, target: 35000 },
  { month: "Dec", production: 30000, target: 32000 },
]

// Colors for pie chart
const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"]

export function RegionalStats() {
  // Calculate totals
  const totalFarms = regionalData.reduce((sum, region) => sum + region.farms, 0)
  const totalCattle = regionalData.reduce((sum, region) => sum + region.cattle, 0)
  const totalProduction = regionalData.reduce((sum, region) => sum + region.production, 0)
  const totalDiseases = regionalData.reduce((sum, region) => sum + region.disease, 0)

  // Calculate year-over-year changes (mock data)
  const farmChange = 8.5
  const cattleChange = 5.2
  const productionChange = 12.3
  const diseaseChange = -3.8

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Registered Farms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFarms}</div>
              <div className="flex items-center mt-1 text-sm">
                {farmChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={farmChange > 0 ? "text-green-500" : "text-red-500"}>
                  {farmChange > 0 ? "+" : ""}
                  {farmChange}% from last year
                </span>
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
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Cattle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCattle.toLocaleString()}</div>
              <div className="flex items-center mt-1 text-sm">
                {cattleChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={cattleChange > 0 ? "text-green-500" : "text-red-500"}>
                  {cattleChange > 0 ? "+" : ""}
                  {cattleChange}% from last year
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Milk Production (L)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProduction.toLocaleString()}</div>
              <div className="flex items-center mt-1 text-sm">
                {productionChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={productionChange > 0 ? "text-green-500" : "text-red-500"}>
                  {productionChange > 0 ? "+" : ""}
                  {productionChange}% from last year
                </span>
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
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Disease Outbreaks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDiseases}</div>
              <div className="flex items-center mt-1 text-sm">
                {diseaseChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                )}
                <span className={diseaseChange > 0 ? "text-red-500" : "text-green-500"}>
                  {diseaseChange > 0 ? "+" : ""}
                  {diseaseChange}% from last year
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-600 dark:text-amber-400">Attention Required</h3>
              <p className="text-amber-700 dark:text-amber-300 text-sm">
                3 farms in Oromia region have reported potential disease outbreaks in the last 7 days. Immediate
                veterinary intervention is recommended.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Regional Distribution</CardTitle>
              <CardDescription>Farms and cattle by region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="farms" name="Farms" fill="#6366f1" />
                    <Bar yAxisId="right" dataKey="cattle" name="Cattle" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Monthly Milk Production</CardTitle>
              <CardDescription>Production vs target (liters)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyProductionData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value.toLocaleString()} L`, undefined]} />
                    <Legend />
                    <Bar dataKey="production" name="Actual Production" fill="#6366f1" />
                    <Line
                      type="monotone"
                      dataKey="target"
                      name="Target"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </ComposedChart>
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
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Farm Types Distribution</CardTitle>
              <CardDescription>Breakdown by farm type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={farmTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {farmTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} farms`, undefined]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Disease Incidents by Region</CardTitle>
              <CardDescription>Reported cases in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="disease" name="Disease Cases" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

