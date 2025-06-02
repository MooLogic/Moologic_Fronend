"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslation } from '@/components/providers/language-provider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Calendar, Clock, AlertCircle, CheckCircle, CalendarIcon, Stethoscope, Scale, Activity } from 'lucide-react'
import { DatePicker } from './date-picker'
import { motion } from 'framer-motion'
import { GestationTimeline } from './gestation-timeline'
import { useGetCattleDataQuery, useGetGestationDataQuery } from '@/lib/service/cattleService'
import { format } from 'date-fns'

interface ExtendedSession extends Record<string, any> {
  user: {
    accessToken: string;
    [key: string]: any;
  };
}

export function GestationDashboard() {
  const { t } = useTranslation()
  const { data: session } = useSession() as { data: ExtendedSession | null }
  const [date, setDate] = useState<Date>()

  const { data: cattleData, isLoading: cattleLoading } = useGetCattleDataQuery(
    { accessToken: session?.user?.accessToken || '' },
    { 
      skip: !session?.user?.accessToken,
      pollingInterval: 30000
    }
  )

  const { data: gestationData, isLoading: gestationLoading, error } = useGetGestationDataQuery(
    { accessToken: session?.user?.accessToken || '' },
    { 
      skip: !session?.user?.accessToken,
      pollingInterval: 30000
    }
  )

  const isLoading = cattleLoading || gestationLoading

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
          <CardDescription>Please wait while we fetch the data.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription className="text-red-500">
            {error instanceof Error ? error.message : 'Failed to fetch data'}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const pregnantCattle = gestationData?.results.map(data => ({
    id: data.cattle.ear_tag_no,
    breed: data.cattle.breed || 'Unknown Breed',
    breedingDate: format(new Date(data.cattle.last_insemination_date), 'yyyy-MM-dd'),
    dueDate: format(new Date(data.cattle.expected_calving_date), 'yyyy-MM-dd'),
    daysLeft: data.cattle.days_until_calving,
    progress: data.cattle.gestation_progress,
    status: data.alerts.length > 0 ? 'attention' : 'normal',
    milestones: data.cattle.milestones,
    healthChecks: data.cattle.gestation_checks || [],
    lactationNumber: data.cattle.current_lactation || 0,
    calvingCount: data.cattle.calving_count || 0,
    lastHealthCheck: data.cattle.gestation_checks?.[0] || null,
    alerts: data.alerts || [],
  })) || []

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

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted/50 backdrop-blur-sm">
            <TabsTrigger value="overview">{t("Overview")}</TabsTrigger>
            <TabsTrigger value="details">{t("Details")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Pregnant
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{pregnantCattle.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Due This Month
                    </CardTitle>
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {pregnantCattle.filter(cow => 
                        new Date(cow.dueDate).getMonth() === new Date().getMonth()
                      ).length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Needs Attention
                    </CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {pregnantCattle.filter(cow => cow.status === 'attention').length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Average Progress
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(
                        pregnantCattle.reduce((acc, cow) => acc + cow.progress, 0) / 
                        (pregnantCattle.length || 1)
                      )}%
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <GestationTimeline animals={cattleData?.results || []} />
            </motion.div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Pregnant Cattle")}</CardTitle>
                  <CardDescription>{t("Monitor the progress of pregnant cattle.")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {pregnantCattle.map((cow) => (
                    <div key={cow.id} className="border rounded-lg p-6 bg-card">
                      <div className="space-y-6">
                        {/* Header Section */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{cow.id}</h3>
                            <Badge variant="outline">{cow.breed}</Badge>
                              {cow.status === "attention" && (
                              <Badge variant="destructive">
                                  {t("Needs Attention")}
                                </Badge>
                              )}
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary">
                              {t("Lactation")}: {cow.lactationNumber}
                            </Badge>
                            <Badge variant="secondary">
                              {t("Calvings")}: {cow.calvingCount}
                            </Badge>
                          </div>
                        </div>

                        {/* Progress Section */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{t("Gestation Progress")}</span>
                            <span>{cow.progress}%</span>
                          </div>
                          <Progress value={cow.progress} className="h-2" />
                        </div>

                        {/* Important Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                          <div>
                              <div className="text-sm font-medium">{t("Breeding Date")}</div>
                              <div className="text-sm text-muted-foreground">{cow.breedingDate}</div>
                            </div>
                              </div>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                              <div>
                              <div className="text-sm font-medium">{t("Due Date")}</div>
                              <div className="text-sm text-muted-foreground">{cow.dueDate}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <div>
                              <div className="text-sm font-medium">{t("Days Left")}</div>
                              <div className="text-sm text-muted-foreground">{cow.daysLeft} days</div>
                            </div>
                          </div>
                        </div>

                        {/* Health Checks */}
                        {cow.lastHealthCheck && (
                          <div className="border-t pt-4">
                            <h4 className="text-sm font-semibold mb-3">{t("Latest Health Check")}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="flex items-center gap-2">
                                <Stethoscope className="h-4 w-4" />
                          <div>
                                  <div className="text-sm font-medium">{t("Status")}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {cow.lastHealthCheck.health_status}
                            </div>
                              </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Scale className="h-4 w-4" />
                              <div>
                                  <div className="text-sm font-medium">{t("Weight")}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {cow.lastHealthCheck.weight} kg
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4" />
                              <div>
                                  <div className="text-sm font-medium">{t("Body Condition")}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {cow.lastHealthCheck.body_condition_score}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Milestones */}
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-semibold mb-3">{t("Upcoming Milestones")}</h4>
                          <div className="grid gap-2">
                            {cow.milestones
                              .filter(m => !m.is_completed)
                              .slice(0, 3)
                              .map(milestone => (
                                <div key={milestone.id} className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded">
                                  <span>{milestone.description}</span>
                                  <span className="text-muted-foreground">
                                    {format(new Date(milestone.due_date), 'MMM d, yyyy')}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Alerts */}
                        {cow.alerts.length > 0 && (
                          <div className="border-t pt-4">
                            <h4 className="text-sm font-semibold mb-3">{t("Active Alerts")}</h4>
                            <div className="space-y-2">
                              {cow.alerts.map((alert, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-destructive">
                                  <AlertCircle className="h-4 w-4" />
                                  <span>{alert.message}</span>
                      </div>
                    ))}
                  </div>
                      </div>
                        )}
                      </div>
                    </div>
                  ))}
                  </div>
                </CardContent>
              </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

