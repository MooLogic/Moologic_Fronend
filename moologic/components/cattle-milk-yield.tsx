"use client"

import { useState } from "react"
import { ArrowLeft, Download, Filter } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LactationCurveChart } from "@/components/lactation-curve-chart"
import { MilkProductionTrendChart } from "@/components/milk-production-trend-chart"
import { MilkQualityChart } from "@/components/milk-quality-chart"
import { DateRangePicker } from "@/components/date-range-picker"
import { useTranslation } from "@/components/providers/language-provider"

export function CattleMilkYield({ cattleId }) {
  const router = useRouter()
  const { t } = useTranslation()
  const [cattleData, setCattleData] = useState({
    id: cattleId,
    name: "Daisy",
    earTag: "#876364",
    lactationNumber: 3,
    daysInMilk: 120,
    currentLactationTotal: 2880,
    averageDailyYield: 24,
    peakYield: 32,
    lastRecordedYield: 22,
    fatPercentage: 3.8,
    proteinPercentage: 3.2,
    lactosePercentage: 4.6,
    somaticCellCount: 150,
  })

  return (
    <main className="flex-1">
      <header className="h-16 px-8 flex items-center border-b border-gray-100 bg-white sticky top-0 z-10">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            {t("Milk Yield")} - {cattleData.earTag} {cattleData.name && `(${cattleData.name})`}
          </h1>
          <p className="text-sm text-gray-500">
            {t("Lactation")} #{cattleData.lactationNumber} • {cattleData.daysInMilk} {t("days in milk")}
          </p>
        </div>
      </header>

      <div className="p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{t("Current Lactation Total")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cattleData.currentLactationTotal} {t("liters")}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{t("Average Daily Yield")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cattleData.averageDailyYield} {t("liters")}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{t("Peak Yield")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cattleData.peakYield} {t("liters")}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{t("Last Recorded Yield")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cattleData.lastRecordedYield} {t("liters")}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter and Date Range */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <DateRangePicker />
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="ml-auto gap-2">
            <Download className="h-4 w-4" />
            {t("Export Data")}
          </Button>
        </div>

        {/* Charts Tabs */}
        <Tabs defaultValue="lactation" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="lactation">{t("Lactation Curve")}</TabsTrigger>
            <TabsTrigger value="trend">{t("Production Trend")}</TabsTrigger>
            <TabsTrigger value="quality">{t("Milk Quality")}</TabsTrigger>
          </TabsList>
          <TabsContent value="lactation">
            <Card>
              <CardHeader>
                <CardTitle>{t("Lactation Curve")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <LactationCurveChart />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="trend">
            <Card>
              <CardHeader>
                <CardTitle>{t("Production Trend")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <MilkProductionTrendChart />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="quality">
            <Card>
              <CardHeader>
                <CardTitle>{t("Milk Quality Parameters")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t("Current Values")}</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t("Fat")}:</span>
                        <span className="font-medium">{cattleData.fatPercentage}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t("Protein")}:</span>
                        <span className="font-medium">{cattleData.proteinPercentage}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t("Lactose")}:</span>
                        <span className="font-medium">{cattleData.lactosePercentage}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t("Somatic Cell Count")}:</span>
                        <span className="font-medium">{cattleData.somaticCellCount} cells/ml</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-[300px]">
                    <MilkQualityChart />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Milk Records Table */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t("Recent Milk Records")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">{t("Date")}</th>
                    <th className="text-left py-3 px-4">{t("Morning (L)")}</th>
                    <th className="text-left py-3 px-4">{t("Evening (L)")}</th>
                    <th className="text-left py-3 px-4">{t("Total (L)")}</th>
                    <th className="text-left py-3 px-4">{t("Fat %")}</th>
                    <th className="text-left py-3 px-4">{t("Protein %")}</th>
                    <th className="text-left py-3 px-4">{t("Notes")}</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(7)].map((_, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{`2024-03-${15 - index}`}</td>
                      <td className="py-3 px-4">{(Math.random() * 5 + 10).toFixed(1)}</td>
                      <td className="py-3 px-4">{(Math.random() * 5 + 8).toFixed(1)}</td>
                      <td className="py-3 px-4 font-medium">{(Math.random() * 10 + 18).toFixed(1)}</td>
                      <td className="py-3 px-4">{(Math.random() * 0.5 + 3.5).toFixed(1)}</td>
                      <td className="py-3 px-4">{(Math.random() * 0.3 + 3.0).toFixed(1)}</td>
                      <td className="py-3 px-4 text-gray-500">{index % 3 === 0 ? t("Normal production") : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

