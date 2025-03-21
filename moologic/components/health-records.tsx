"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VaccinationRecords } from "@/components/vaccination-records"
import { TreatmentRecords } from "@/components/treatment-records"

export function HealthRecords() {
  return (
    <main className="flex-1">
      <header className="h-16 px-8 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-gray-800">Health Records</h1>
        <div className="text-lg font-medium text-gray-800">Anan Dairy Farm</div>
      </header>

      <div className="p-8">
        <Tabs defaultValue="vaccinations" className="w-full">
          <TabsList className="grid w-[400px] grid-cols-2 mb-8">
            <TabsTrigger value="vaccinations">Vaccination Records</TabsTrigger>
            <TabsTrigger value="treatments">Treatment Records</TabsTrigger>
          </TabsList>
          <TabsContent value="vaccinations">
            <VaccinationRecords />
          </TabsContent>
          <TabsContent value="treatments">
            <TreatmentRecords />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

