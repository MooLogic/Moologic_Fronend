"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useTranslation } from "@/components/providers/language-provider"
import { Plus } from "lucide-react"
import Link from "next/link"
import { LoadingScreen } from "@/components/loading-screen"
import { AllAnimals } from "@/components/all-animals"
import { useGetCattleDataQuery } from "@/lib/service/cattleService"
import { useSession } from "next-auth/react"

export function LivestockDashboard() {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ""

  // Fetch cattle data using RTK Query
  const {
    data: cattleData,
    isLoading,
    error,
  } = useGetCattleDataQuery({ accessToken }, { skip: !accessToken })

  const [activeTab, setActiveTab] = useState("all")

  // Handle loading and error states
  if (isLoading) {
    return <LoadingScreen />
  }

  if (error) {
    console.error("Failed to load cattle data:", error)
    return <div className="text-red-500">{t("Failed to load cattle data")}</div>
  }

  // Use cattle data (assuming cattleData.results contains the array of cattle)
  const cattle = cattleData?.results || []

  // Calculate statistics
  const totalCattle = cattle.length
  const femaleCattle = cattle.filter((c: { gender: string }) => c.gender === "female").length
  const maleCattle = cattle.filter((c: { gender: string }) => c.gender === "male").length
  const pregnantCattle = cattle.filter((c: { gestation_status: string }) => c.gestation_status === "pregnant").length
  const calvingCattle = cattle.filter((c: { gestation_status: string }) => c.gestation_status === "calving").length
  const healthyCattle = cattle.filter((c: { health_status: string }) => c.health_status === "healthy").length
  const sickCattle = cattle.filter((c: { health_status: string }) => c.health_status === "sick").length

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("Livestock Management")}</h2>
          <p className="text-muted-foreground">{t("Manage and monitor your entire herd from one place")}</p>
        </div>
        <Link href="/livestock/add">
          <Button className="mt-4 sm:mt-0">
            <Plus className="mr-2 h-4 w-4" /> {t("Add New Animal")}
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Total Cattle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCattle}</div>
            <p className="text-xs text-muted-foreground">{t("Total number of animals in your herd")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Female / Male")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {femaleCattle} / {maleCattle}
            </div>
            <p className="text-xs text-muted-foreground">{t("Distribution of female and male animals")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Pregnant / Calving")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pregnantCattle} / {calvingCattle}
            </div>
            <p className="text-xs text-muted-foreground">{t("Number of pregnant and calving animals")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Healthy / Sick")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthyCattle} / {sickCattle}
            </div>
            <p className="text-xs text-muted-foreground">{t("Health status of your herd")}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">{t("All Animals")}</TabsTrigger>
          <TabsTrigger value="cows">{t("Cows")}</TabsTrigger>
          <TabsTrigger value="heifers">{t("Heifers")}</TabsTrigger>
          <TabsTrigger value="calves">{t("Calves")}</TabsTrigger>
          <TabsTrigger value="bulls">{t("Bulls")}</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>{t("All Animals")}</CardTitle>
              <CardDescription>{t("View and manage all animals in your herd")}</CardDescription>
            </CardHeader>
            <CardContent>
              <AllAnimals animals={cattle} showFilters={true} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cows">
          <Card>
            <CardHeader>
              <CardTitle>{t("Cows")}</CardTitle>
              <CardDescription>{t("View and manage all cows in your herd")}</CardDescription>
            </CardHeader>
            <CardContent>
              <AllAnimals animals={cattle.filter((c: { life_stage: string }) => c.life_stage === "cow")} showFilters={false} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="heifers">
          <Card>
            <CardHeader>
              <CardTitle>{t("Heifers")}</CardTitle>
              <CardDescription>{t("View and manage all heifers in your herd")}</CardDescription>
            </CardHeader>
            <CardContent>
              <AllAnimals animals={cattle.filter((c: { life_stage: string }) => c.life_stage === "heifer")} showFilters={false} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calves">
          <Card>
            <CardHeader>
              <CardTitle>{t("Calves")}</CardTitle>
              <CardDescription>{t("View and manage all calves in your herd")}</CardDescription>
            </CardHeader>
            <CardContent>
              <AllAnimals animals={cattle.filter((c: { life_stage: string }) => c.life_stage === "calf")} showFilters={false} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bulls">
          <Card>
            <CardHeader>
              <CardTitle>{t("Bulls")}</CardTitle>
              <CardDescription>{t("View and manage all bulls in your herd")}</CardDescription>
            </CardHeader>
            <CardContent>
              <AllAnimals animals={cattle.filter((c: { life_stage: string }) => c.life_stage === "bull")} showFilters={false} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}