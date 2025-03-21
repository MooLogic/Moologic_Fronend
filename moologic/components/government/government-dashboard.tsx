"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FarmsList } from "@/components/government/farms-list"
import { RegionalStats } from "@/components/government/regional-stats"
import { HealthAlerts } from "@/components/government/health-alerts"
import { ProductionTrends } from "@/components/government/production-trends"
import { Building2, LogOut, BarChart3, MapPin, AlertTriangle, TrendingUp, Users } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function GovernmentDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    region: "all",
    farmType: "all",
    searchQuery: "",
  })

  useEffect(() => {
    // Check if user is logged in and has government role
    const governmentUser = localStorage.getItem("governmentUser")
    const userRole = localStorage.getItem("userRole")

    if (!governmentUser || userRole !== "government") {
      router.push("/auth/login")
      return
    }

    try {
      const parsedUser = JSON.parse(governmentUser)
      setUserData(parsedUser)
    } catch (error) {
      console.error("Error parsing user data:", error)
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  const handleLogout = () => {
    // Clear government user data
    localStorage.removeItem("governmentUser")

    toast({
      title: "Logged out",
      description: "You have been logged out of the government dashboard",
    })

    // Redirect to login
    router.push("/auth/login")
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-indigo-600 mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-semibold">Loading government dashboard...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Government Oversight Dashboard</h1>
              <p className="text-muted-foreground">
                {userData?.department} | {userData?.region === "all" ? "All Regions" : userData?.region}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          <p className="text-muted-foreground">
            Monitor dairy farms, track health alerts, and analyze production trends
          </p>
        </div>

        {/* Filters */}
        {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search farms..."
                  className="pl-10"
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={filters.region} onValueChange={(value) => handleFilterChange("region", value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="addis_ababa">Addis Ababa</SelectItem>
                  <SelectItem value="oromia">Oromia</SelectItem>
                  <SelectItem value="amhara">Amhara</SelectItem>
                  <SelectItem value="tigray">Tigray</SelectItem>
                  <SelectItem value="snnpr">SNNPR</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.farmType} onValueChange={(value) => handleFilterChange("farmType", value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Farm type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="dairy">Dairy Farms</SelectItem>
                  <SelectItem value="mixed">Mixed Livestock</SelectItem>
                  <SelectItem value="beef">Beef Cattle</SelectItem>
                </SelectContent>
              </Select>

              <DateRangePicker />

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>

              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div> */}

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="farms" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Farms</span>
              </TabsTrigger>
              <TabsTrigger value="health" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Health Alerts</span>
              </TabsTrigger>
              <TabsTrigger value="production" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Production</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Farms"
                value="1,248"
                description="Registered dairy farms"
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                trend="+12% from last month"
                trendUp={true}
              />
              <StatCard
                title="Milk Production"
                value="3.2M"
                description="Gallons this month"
                icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
                trend="+8% from last month"
                trendUp={true}
              />
              <StatCard
                title="Health Alerts"
                value="24"
                description="Active alerts"
                icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
                trend="-3% from last month"
                trendUp={false}
              />
              <StatCard
                title="Regions"
                value="32"
                description="Active regions"
                icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
                trend="No change"
                trendUp={null}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <RegionalStats />
              <HealthAlerts compact={true} />
            </div>

            <ProductionTrends />
          </TabsContent>

          <TabsContent value="farms" className="space-y-4">
            <FarmsList filters={filters} />
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <HealthAlerts compact={false} />
          </TabsContent>

          <TabsContent value="production" className="space-y-4">
            <ProductionTrends detailed={true} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend: string
  trendUp: boolean | null
}

function StatCard({ title, value, description, icon, trend, trendUp }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div
          className={`mt-2 text-xs ${
            trendUp === true ? "text-green-500" : trendUp === false ? "text-red-500" : "text-muted-foreground"
          }`}
        >
          {trend}
        </div>
      </CardContent>
    </Card>
  )
}

