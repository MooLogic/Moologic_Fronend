"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useTranslation } from "@/components/providers/language-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VaccinationRecords } from "@/components/vaccination-records"
import { TreatmentRecords } from "@/components/treatment-records"
import { PeriodicVaccinations } from "@/components/periodic-vaccinations"
import { PeriodicTreatments } from "@/components/periodic-treatments"
import { useRouter } from "next/navigation"

interface HealthRecordsProps {
  defaultTab?: string
  selectedCattleId?: string | null
}

export function HealthRecords({ defaultTab = "treatments", selectedCattleId }: HealthRecordsProps) {
  const { t } = useTranslation()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(defaultTab)
  
  // Extract token from session
  const accessToken = session?.user?.accessToken

  // Debug session and token
  useEffect(() => {
    console.log('Session Status:', status)
    console.log('Session:', session)
    console.log('Access Token:', accessToken)
  }, [session, status, accessToken])

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set("tab", activeTab)
    if (selectedCattleId) {
      url.searchParams.set("cattle", selectedCattleId)
    }
    router.replace(url.pathname + url.search)
  }, [activeTab, selectedCattleId, router])

  if (status === "loading") {
    return <div className="p-6">{t("Loading...")}</div>
  }

  if (status === "unauthenticated" || !session) {
    return <div className="p-6 text-red-500">{t("Please log in to view health records")}</div>
  }

  if (!accessToken) {
    return (
      <div className="p-6 text-red-500">
        {t("Authentication token is missing. Please try logging out and logging in again.")}
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t("Health Records")}</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="treatments">{t("Treatments")}</TabsTrigger>
          <TabsTrigger value="vaccinations">{t("Vaccinations")}</TabsTrigger>
          <TabsTrigger value="periodic-treatments">{t("Periodic Treatments")}</TabsTrigger>
          <TabsTrigger value="periodic-vaccinations">{t("Periodic Vaccinations")}</TabsTrigger>
          </TabsList>
        <TabsContent value="treatments">
          <TreatmentRecords selectedCattleId={selectedCattleId} accessToken={accessToken} />
        </TabsContent>
          <TabsContent value="vaccinations">
          <VaccinationRecords selectedCattleId={selectedCattleId} accessToken={accessToken} />
        </TabsContent>
        <TabsContent value="periodic-treatments">
          <PeriodicTreatments accessToken={accessToken} />
          </TabsContent>
        <TabsContent value="periodic-vaccinations">
          <PeriodicVaccinations accessToken={accessToken} />
          </TabsContent>
        </Tabs>
      </div>
  )
}

