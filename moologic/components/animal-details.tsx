"use client"

import { Plus, AlertTriangle, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetCattleByIdQuery } from "@/lib/service/cattleService"
import { useGetCattleHealthRecordsQuery } from "@/lib/service/healthService"
import { useSession } from "next-auth/react"
import { useTranslation } from "@/components/providers/language-provider"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"

export function AnimalDetails({ animalId }: { animalId: string }) {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ""
  const { data: animal, isLoading, error } = useGetCattleByIdQuery(
    { accessToken, id: animalId },
    { 
      skip: !accessToken || !animalId,
      refetchOnMountOrArgChange: true 
    }
  )

  const { data: healthRecords, isLoading: isLoadingHealth, error: healthError } = useGetCattleHealthRecordsQuery(
    { accessToken, cattleId: animalId },
    { 
      skip: !accessToken || !animalId,
      refetchOnMountOrArgChange: true 
    }
  )

  const router = useRouter()

  const formatDateValue = (value?: string | null) =>
    value ? format(new Date(value), "MMM d, yyyy") : "-"

  const formatEnum = (value?: string) =>
    value ? t(value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())) : "-"

  const formatValue = (value?: string | number | null) =>
    value === undefined || value === null || value === "" ? "-" : value

  const formatArray = (value?: string[] | null) =>
    value && value.length ? value.join(", ") : "-"

  if (!animalId) {
    return <div className="container mx-auto p-4 text-red-500">{t("Invalid cattle ID")}</div>
  }

  if (!accessToken) {
    return <div className="container mx-auto p-4 text-red-500">{t("Please log in to view animal details")}</div>
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-8 w-[200px] mb-6" />
        <Skeleton className="h-[200px] w-full mb-4" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  if (error) {
    console.error("Error loading animal details:", error)
    return (
      <div className="container mx-auto p-4 text-red-500">
        {t("Failed to load animal details")}
        {error instanceof Error ? `: ${error.message}` : ""}
      </div>
    )
  }

  if (!animal) {
    return <div className="container mx-auto p-4 text-red-500">{t("Animal not found")}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-center gap-2">
        <Button variant="ghost" onClick={() => router.push("/livestock")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("Back to Livestock")}
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-6">{t("Animal Details")}</h1>

      <Tabs defaultValue="info">
        <TabsList className="mb-4">
          <TabsTrigger value="info">{t("Basic Info")}</TabsTrigger>
          <TabsTrigger value="health">{t("Health Records")}</TabsTrigger>
          <TabsTrigger value="breeding">{t("Breeding History")}</TabsTrigger>
          <TabsTrigger value="alerts">{t("Alerts")}</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="rounded-lg overflow-hidden mb-6">
                  {animal.photo ? (
              <img
                      src={animal.photo}
                      alt={`${animal.ear_tag_no} - ${animal.breed || t("Unknown breed")}`}
                      className="w-full h-[300px] object-cover rounded-lg"
              />
                  ) : (
                    <div className="w-full h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">{t("No photo available")}</span>
                    </div>
                  )}
            </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">{t("Ear Tag Number")}:</div>
                    <div className="font-medium">{animal.ear_tag_no}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">{t("Breed")}:</div>
                    <div className="font-medium">{formatValue(animal.breed)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">{t("Birth Date")}:</div>
                    <div className="font-medium">{formatDateValue(animal.birth_date)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">{t("Gender")}:</div>
                    <div className="font-medium">{formatEnum(animal.gender)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">{t("Life Stage")}:</div>
                    <div className="font-medium">{formatEnum(animal.life_stage)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">{t("Life Stage Started")}:</div>
                    <div className="font-medium">{formatDateValue(animal.life_stage_started_at)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">{t("Sire ID")}:</div>
                    <div className="font-medium">{formatValue(animal.sire_id)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">{t("Dam ID")}:</div>
                    <div className="font-medium">{formatValue(animal.dam_id)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">{t("Gestation Status")}:</div>
                    <div className="font-medium">{formatEnum(animal.gestation_status)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">{t("Gestation Stage")}:</div>
                    <div className="font-medium">{formatEnum(animal.gestation_stage)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">{t("Health Status")}:</div>
                    <div className="font-medium">{formatEnum(animal.health_status)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">{t("Service Bull")}:</div>
                    <div className="font-medium">{animal.is_service_bull ? t("Yes") : t("No")}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">{t("Birth Weight")}:</div>
                    <div className="font-medium">{formatValue(animal.birth_weight)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">{t("Current Weight")}:</div>
                    <div className="font-medium">{formatValue(animal.current_weight)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">{t("Weaning Date")}:</div>
                    <div className="font-medium">{formatDateValue(animal.weaning_date)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">{t("Weaning Weight")}:</div>
                    <div className="font-medium">{formatValue(animal.weaning_weight)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">{t("Milking Frequency")}:</div>
                    <div className="font-medium">{formatEnum(animal.milking_frequency)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">{t("Avg Daily Milk (L)")}:</div>
                    <div className="font-medium">{formatValue(animal.avg_daily_milk)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">{t("Custom Milking Times")}:</div>
                    <div className="font-medium">{formatArray(animal.custom_milking_times as string[] | null)}</div>
                  </div>
                  {animal.is_purchased && (
                    <>
                      <div>
                        <div className="text-gray-500">{t("Purchase Date")}:</div>
                        <div className="font-medium">{formatDateValue(animal.purchase_date)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">{t("Purchase Source")}:</div>
                        <div className="font-medium">{formatValue(animal.purchase_source)}</div>
                      </div>
                    </>
                  )}
                  <div>
                    <div className="text-gray-500">{t("Last Insemination")}:</div>
                    <div className="font-medium">{formatDateValue(animal.last_insemination_date)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">{t("Last Calving")}:</div>
                    <div className="font-medium">{formatDateValue(animal.last_calving_date)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">{t("Expected Calving")}:</div>
                    <div className="font-medium">{formatDateValue(animal.expected_calving_date)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">{t("Expected Insemination")}:</div>
                    <div className="font-medium">{formatDateValue(animal.expected_insemination_date)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="health">
          <div className="space-y-6">
            {isLoadingHealth && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("Loading health records...")}
              </div>
            )}
            {healthError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{t("Unable to load health data")}</AlertTitle>
                <AlertDescription>{t("Please try again later.")}</AlertDescription>
              </Alert>
            )}
            <div className="flex gap-4 mb-6">
              <Button onClick={() => router.push(`/health-records?tab=vaccinations&cattle=${animalId}`)}>
                <Plus className="h-4 w-4 mr-2" />
                {t("Add Vaccination")}
              </Button>
              <Button onClick={() => router.push(`/health-records?tab=treatments&cattle=${animalId}`)}>
                <Plus className="h-4 w-4 mr-2" />
                {t("Add Treatment")}
              </Button>
              <Button onClick={() => router.push(`/health-records?tab=periodic-vaccinations&cattle=${animalId}`)}>
                <Plus className="h-4 w-4 mr-2" />
                {t("Add Periodic Vaccination")}
              </Button>
              <Button onClick={() => router.push(`/health-records?tab=periodic-treatments&cattle=${animalId}`)}>
                <Plus className="h-4 w-4 mr-2" />
                {t("Add Periodic Treatment")}
              </Button>
            </div>

            {/* Vaccinations */}
            <Card>
              <CardHeader>
                <CardTitle>{t("Vaccination Records")}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("Vaccination")}</TableHead>
                      <TableHead>{t("Date")}</TableHead>
                      <TableHead>{t("Next Due")}</TableHead>
                      <TableHead>{t("Status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {healthRecords?.vaccinations?.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.vaccination_name}</TableCell>
                        <TableCell>{format(new Date(record.vaccination_date), "PP")}</TableCell>
                        <TableCell>
                          {record.next_vaccination_date && format(new Date(record.next_vaccination_date), "PP")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              new Date(record.next_vaccination_date) < new Date()
                                ? "destructive"
                                : new Date(record.next_vaccination_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                                ? "warning"
                                : "default"
                            }
                          >
                            {new Date(record.next_vaccination_date) < new Date()
                              ? t("Overdue")
                              : new Date(record.next_vaccination_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                              ? t("Due Soon")
                              : t("Up to Date")}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Treatments */}
            <Card>
              <CardHeader>
                <CardTitle>{t("Treatment Records")}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("Treatment")}</TableHead>
                      <TableHead>{t("Description")}</TableHead>
                      <TableHead>{t("Date")}</TableHead>
                      <TableHead>{t("Cost")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {healthRecords?.treatments?.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.treatment_name}</TableCell>
                        <TableCell>{record.treatment_description}</TableCell>
                        <TableCell>{format(new Date(record.treatment_date), "PP")}</TableCell>
                        <TableCell>
                          {record.treatment_cost ? `$${record.treatment_cost.toFixed(2)}` : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Periodic Vaccinations */}
            <Card>
              <CardHeader>
                <CardTitle>{t("Periodic Vaccinations")}</CardTitle>
              </CardHeader>
              <CardContent>
                {healthRecords?.periodicVaccinations?.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("Vaccination")}</TableHead>
                        <TableHead>{t("Last Date")}</TableHead>
                        <TableHead>{t("Next Due")}</TableHead>
                        <TableHead>{t("Interval")}</TableHead>
                        <TableHead>{t("Status")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {healthRecords?.periodicVaccinations?.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.vaccination_name}</TableCell>
                          <TableCell>{format(new Date(record.last_vaccination_date), "PP")}</TableCell>
                          <TableCell>{format(new Date(record.next_vaccination_date), "PP")}</TableCell>
                          <TableCell>
                            {record.interval_days === 30
                              ? t("Monthly")
                              : record.interval_days === 90
                              ? t("Quarterly")
                              : record.interval_days === 180
                              ? t("Semi-Annually")
                              : t("Annually")}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                new Date(record.next_vaccination_date) < new Date()
                                  ? "destructive"
                                  : new Date(record.next_vaccination_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                                  ? "warning"
                                  : "default"
                              }
                            >
                              {new Date(record.next_vaccination_date) < new Date()
                                ? t("Overdue")
                                : new Date(record.next_vaccination_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                                ? t("Due Soon")
                                : t("Scheduled")}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-sm text-gray-500">{t("No periodic vaccinations recorded")}</div>
                )}
              </CardContent>
            </Card>

            {/* Periodic Treatments */}
            <Card>
              <CardHeader>
                <CardTitle>{t("Periodic Treatments")}</CardTitle>
              </CardHeader>
              <CardContent>
                {healthRecords?.periodicTreatments?.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("Treatment")}</TableHead>
                        <TableHead>{t("Description")}</TableHead>
                        <TableHead>{t("Last Date")}</TableHead>
                        <TableHead>{t("Next Due")}</TableHead>
                        <TableHead>{t("Interval")}</TableHead>
                        <TableHead>{t("Status")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {healthRecords?.periodicTreatments?.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.treatment_name}</TableCell>
                          <TableCell>{record.treatment_description}</TableCell>
                          <TableCell>{format(new Date(record.last_treatment_date), "PP")}</TableCell>
                          <TableCell>{format(new Date(record.next_treatment_date), "PP")}</TableCell>
                          <TableCell>
                            {record.interval_days === 30
                              ? t("Monthly")
                              : record.interval_days === 90
                              ? t("Quarterly")
                              : record.interval_days === 180
                              ? t("Semi-Annually")
                              : t("Annually")}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                new Date(record.next_treatment_date) < new Date()
                                  ? "destructive"
                                  : new Date(record.next_treatment_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                                  ? "warning"
                                  : "default"
                              }
                            >
                              {new Date(record.next_treatment_date) < new Date()
                                ? t("Overdue")
                                : new Date(record.next_treatment_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                                ? t("Due Soon")
                                : t("Scheduled")}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-sm text-gray-500">{t("No periodic treatments recorded")}</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="breeding">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <CardTitle className="text-base">{t("Inseminations")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="text-sm">
                <div>{t("Insemination Count")}: {animal?.inseminations?.length || 0}</div>
                <div>{t("Last Insemination")}: {animal.last_insemination_date ? format(new Date(animal.last_insemination_date), "MMM d, yyyy") : "-"}</div>
              </div>
              {animal?.inseminations?.map((insemination) => (
                <div key={insemination.id} className="text-sm border-b py-2">
                  <div>{t("Date")}: {format(new Date(insemination.insemination_date), "MMM d, yyyy")}</div>
                  <div>{t("Bull ID")}: {insemination.bull_id || "-"}</div>
                  <div>{t("Method")}: {t(insemination.insemination_method.charAt(0).toUpperCase() + insemination.insemination_method.slice(1))}</div>
                  <div>{t("Status")}: {t(insemination.insemination_status.charAt(0).toUpperCase() + insemination.insemination_status.slice(1))}</div>
                </div>
              ))}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">{t("View Details")}</Button>
                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("Add Insemination")}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <CardTitle className="text-base">{t("Birth Records")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="text-sm">
                <div>{t("Calving Count")}: {animal?.birth_records?.length || 0}</div>
                <div>{t("Last Calving")}: {animal.last_calving_date ? format(new Date(animal.last_calving_date), "MMM d, yyyy") : "-"}</div>
              </div>
              {animal?.birth_records?.map((record) => (
                <div key={record.id} className="text-sm border-b py-2">
                  <div>{t("Date")}: {format(new Date(record.calving_date), "MMM d, yyyy")}</div>
                  <div>{t("Outcome")}: {t(record.calving_outcome.charAt(0).toUpperCase() + record.calving_outcome.slice(1))}</div>
                </div>
              ))}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">{t("View Details")}</Button>
                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("Add Birth Record")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <CardTitle className="text-base">{t("Alerts")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {!animal?.alerts?.length ? (
                <div className="text-sm text-gray-500">{t("No alerts available")}</div>
              ) : (
                animal.alerts.map((alert) => (
                  <div key={alert.id} className="text-sm border-b py-2">
                    <div>{t("Message")}: {alert.message}</div>
                    <div>{t("Due Date")}: {format(new Date(alert.due_date), "MMM d, yyyy")}</div>
                    <div>{t("Priority")}: {t(alert.priority)}</div>
                    <div>{t("Status")}: {alert.is_read ? t("Read") : t("Unread")}</div>
                  </div>
                ))
              )}
              <Button variant="outline" className="w-full">{t("View All Alerts")}</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}