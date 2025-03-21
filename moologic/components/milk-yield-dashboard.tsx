"use client"

import { useTranslation } from "@/components/providers/language-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MilkProductionChart } from "@/components/milk-production-chart"
import { LactationDonutChart } from "@/components/lactation-donut-chart"
import { MilkProductionStatsChart } from "@/components/milk-production-stats-chart"
import { TopCows } from "@/components/top-cows"
import { LessPerformingTable } from "@/components/less-performing-table"
import { DateRangePicker } from "@/components/date-range-picker"
import { motion } from "framer-motion"

export function MilkYieldDashboard() {
  const { t } = useTranslation()

  return (
    <div className="relative">
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-40 left-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <motion.h1
            className="text-3xl font-bold tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t("Milk Yield Dashboard")}
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("Monitor and analyze milk production across your herd.")}
          </motion.p>
        </div>

        <motion.div
          className="flex justify-end"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <DateRangePicker />
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted/50 backdrop-blur-sm">
            <TabsTrigger value="overview">{t("Overview")}</TabsTrigger>
            <TabsTrigger value="production">{t("Production")}</TabsTrigger>
            <TabsTrigger value="animals">{t("Animals")}</TabsTrigger>
            <TabsTrigger value="analytics">{t("Analytics")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <MilkProductionChart />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <LactationDonutChart />
              </motion.div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <TopCows />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <MilkProductionStatsChart />
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="production" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("Daily Production")}</CardTitle>
                  <CardDescription>{t("Daily milk production for the selected period.")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <MilkProductionChart />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="animals" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <LessPerformingTable />
            </motion.div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("Production Analytics")}</CardTitle>
                  <CardDescription>{t("Advanced analytics for milk production.")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <MilkProductionStatsChart />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

