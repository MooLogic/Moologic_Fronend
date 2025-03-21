"use client"

import { useState } from "react"
import { useTranslation } from "@/components/providers/language-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, AlertCircle, CheckCircle, CalendarIcon } from "lucide-react"
import { DatePicker } from "@/components/date-picker"
import { motion } from "framer-motion"

export function GestationDashboard() {
  const { t } = useTranslation()
  const [date, setDate] = useState<Date>()

  // Sample data for pregnant cattle
  const pregnantCattle = [
    {
      id: "COW001",
      name: "Bella",
      breedingDate: "2023-05-15",
      dueDate: "2024-02-22",
      daysLeft: 45,
      progress: 84,
      status: "normal",
    },
    {
      id: "COW007",
      name: "Daisy",
      breedingDate: "2023-06-10",
      dueDate: "2024-03-18",
      daysLeft: 70,
      progress: 75,
      status: "normal",
    },
    {
      id: "COW012",
      name: "Rosie",
      breedingDate: "2023-07-05",
      dueDate: "2024-04-12",
      daysLeft: 95,
      progress: 65,
      status: "attention",
    },
    {
      id: "COW015",
      name: "Lily",
      breedingDate: "2023-08-20",
      dueDate: "2024-05-27",
      daysLeft: 140,
      progress: 48,
      status: "normal",
    },
  ]

  // Sample data for recent calvings
  const recentCalvings = [
    {
      id: "COW003",
      name: "Molly",
      calvingDate: "2024-01-05",
      calfCount: 1,
      calfGender: "Female",
      calfWeight: "35 kg",
      status: "healthy",
    },
    {
      id: "COW009",
      name: "Lucy",
      calvingDate: "2024-01-12",
      calfCount: 2,
      calfGender: "Male, Female",
      calfWeight: "32 kg, 30 kg",
      status: "attention",
    },
    {
      id: "COW005",
      name: "Buttercup",
      calvingDate: "2024-01-18",
      calfCount: 1,
      calfGender: "Male",
      calfWeight: "38 kg",
      status: "healthy",
    },
  ]

  // Sample data for upcoming inseminations
  const upcomingInseminations = [
    {
      id: "COW022",
      name: "Clover",
      heatDate: "2024-01-28",
      inseminationDate: "2024-01-30",
      bullInfo: "Holstein Premium",
      notes: "Second insemination attempt",
    },
    {
      id: "COW018",
      name: "Poppy",
      heatDate: "2024-01-30",
      inseminationDate: "2024-02-01",
      bullInfo: "Jersey Elite",
      notes: "First insemination",
    },
    {
      id: "COW025",
      name: "Tulip",
      heatDate: "2024-02-03",
      inseminationDate: "2024-02-05",
      bullInfo: "Angus Select",
      notes: "Third insemination attempt",
    },
  ]

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
            {t("Gestation Management")}
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("Track and manage pregnancies, calvings, and inseminations.")}
          </motion.p>
        </div>

        <motion.div
          className="flex justify-end"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <DatePicker date={date} setDate={setDate} />
        </motion.div>

        <Tabs defaultValue="pregnancies" className="space-y-6">
          <TabsList className="bg-muted/50 backdrop-blur-sm">
            <TabsTrigger value="pregnancies">{t("Pregnancies")}</TabsTrigger>
            <TabsTrigger value="calvings">{t("Recent Calvings")}</TabsTrigger>
            <TabsTrigger value="inseminations">{t("Upcoming Inseminations")}</TabsTrigger>
            <TabsTrigger value="timeline">{t("Timeline")}</TabsTrigger>
          </TabsList>

          <TabsContent value="pregnancies" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{t("Pregnant Cattle")}</CardTitle>
                  <CardDescription>{t("Monitor the progress of pregnant cattle.")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {pregnantCattle.map((cow) => (
                      <div key={cow.id} className="border rounded-lg p-4 bg-card">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold">{cow.name}</h3>
                              <Badge variant="outline">{cow.id}</Badge>
                              {cow.status === "attention" && (
                                <Badge variant="destructive" className="ml-2">
                                  {t("Needs Attention")}
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {t("Bred")}: {cow.breedingDate}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4" />
                                <span>
                                  {t("Due")}: {cow.dueDate}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {cow.daysLeft} {t("days left")}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              {t("Details")}
                            </Button>
                            <Button variant="outline" size="sm">
                              {t("Record Check")}
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{t("Gestation Progress")}</span>
                            <span>{cow.progress}%</span>
                          </div>
                          <Progress value={cow.progress} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="calvings" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("Recent Calvings")}</CardTitle>
                  <CardDescription>{t("Records of recent calving events.")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentCalvings.map((record) => (
                      <div key={record.id} className="border rounded-lg p-4 bg-card">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold">{record.name}</h3>
                              <Badge variant="outline">{record.id}</Badge>
                              {record.status === "attention" ? (
                                <Badge variant="destructive" className="ml-2">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  {t("Needs Attention")}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-2">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  {t("Healthy")}
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {t("Calving Date")}: {record.calvingDate}
                                </span>
                              </div>
                              <div>
                                <span>
                                  {t("Calves")}: {record.calfCount}
                                </span>
                              </div>
                              <div>
                                <span>
                                  {t("Gender")}: {record.calfGender}
                                </span>
                              </div>
                              <div>
                                <span>
                                  {t("Weight")}: {record.calfWeight}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              {t("Details")}
                            </Button>
                            <Button variant="outline" size="sm">
                              {t("Health Records")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="inseminations" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("Upcoming Inseminations")}</CardTitle>
                  <CardDescription>{t("Schedule of upcoming insemination events.")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {upcomingInseminations.map((record) => (
                      <div key={record.id} className="border rounded-lg p-4 bg-card">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold">{record.name}</h3>
                              <Badge variant="outline">{record.id}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {t("Heat Date")}: {record.heatDate}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4" />
                                <span>
                                  {t("Insemination Date")}: {record.inseminationDate}
                                </span>
                              </div>
                              <div>
                                <span>
                                  {t("Bull")}: {record.bullInfo}
                                </span>
                              </div>
                              <div>
                                <span>
                                  {t("Notes")}: {record.notes}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              {t("Details")}
                            </Button>
                            <Button variant="outline" size="sm">
                              {t("Reschedule")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("Reproductive Timeline")}</CardTitle>
                  <CardDescription>{t("Timeline of reproductive events.")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3 pl-8 py-2 space-y-10">
                    {/* Timeline items */}
                    <div className="relative">
                      <div className="absolute -left-11 mt-1.5 h-6 w-6 rounded-full border border-white bg-primary flex items-center justify-center">
                        <span className="text-white text-xs">1</span>
                      </div>
                      <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                        January 30, 2024
                      </time>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t("Insemination")} - Poppy (COW018)
                      </h3>
                      <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                        {t("First insemination scheduled with Jersey Elite bull.")}
                      </p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-11 mt-1.5 h-6 w-6 rounded-full border border-white bg-primary flex items-center justify-center">
                        <span className="text-white text-xs">2</span>
                      </div>
                      <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                        January 18, 2024
                      </time>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t("Calving")} - Buttercup (COW005)
                      </h3>
                      <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                        {t("Successful calving of a healthy male calf weighing 38 kg.")}
                      </p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-11 mt-1.5 h-6 w-6 rounded-full border border-white bg-primary flex items-center justify-center">
                        <span className="text-white text-xs">3</span>
                      </div>
                      <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                        January 12, 2024
                      </time>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t("Calving")} - Lucy (COW009)
                      </h3>
                      <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                        {t("Twin calving - male and female. Requires veterinary attention.")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

