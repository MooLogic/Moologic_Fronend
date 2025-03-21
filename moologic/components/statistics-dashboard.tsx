"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MilkProductionStatsChart } from "@/components/milk-production-stats-chart"
import { ReproductionStatsChart } from "@/components/reproduction-stats-chart"
import { HealthStatsChart } from "@/components/health-stats-chart"
import { FinancialStatsChart } from "@/components/financial-stats-chart"
import { useTranslation } from "@/components/providers/language-provider"
import { useMobile } from "@/hooks/use-mobile"

export function StatisticsDashboard() {
  const { t } = useTranslation()
  const isMobile = useMobile()

  // Sample statistics data
  const farmStats = {
    totalCattle: 234,
    milkingCows: 123,
    averageMilkYield: 19.2,
    pregnancyRate: 42,
    calfMortalityRate: 3,
    diseaseIncidence: 5,
    profitPerCow: 1250,
    feedCostPerLiter: 0.28,
  }

  return (
    <main className="flex-1">
      <header className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800 sticky top-0 z-10">
        <h1 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">{t("Farm Statistics")}</h1>
        <div className="text-base md:text-lg font-medium text-gray-800 dark:text-gray-100">Anan Dairy Farm</div>
      </header>

      <div className="p-4 md:p-8">
        {/* Filter and Date Range */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <DateRangePicker />
          <Button variant="outline" className="md:ml-auto gap-2 w-full md:w-auto">
            <Download className="h-4 w-4" />
            {t("Export Report")}
          </Button>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{t("Average Milk Yield")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {farmStats.averageMilkYield} {t("liters/cow/day")}
              </div>
              <div className="flex items-center mt-1 text-green-600 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+5% {t("from last month")}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{t("Pregnancy Rate")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{farmStats.pregnancyRate}%</div>
              <div className="flex items-center mt-1 text-green-600 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+3% {t("from last month")}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{t("Disease Incidence")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{farmStats.diseaseIncidence}%</div>
              <div className="flex items-center mt-1 text-green-600 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>-2% {t("from last month")}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{t("Profit Per Cow")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">${farmStats.profitPerCow}</div>
              <div className="flex items-center mt-1 text-green-600 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+8% {t("from last month")}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Tabs */}
        <Tabs defaultValue="milk" className="w-full">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="milk">{t("Milk Production")}</TabsTrigger>
            <TabsTrigger value="reproduction">{t("Reproduction")}</TabsTrigger>
            <TabsTrigger value="health">{t("Health")}</TabsTrigger>
            <TabsTrigger value="financial">{t("Financial")}</TabsTrigger>
          </TabsList>

          <TabsContent value="milk">
            <Card>
              <CardHeader>
                <CardTitle>{t("Milk Production Statistics")}</CardTitle>
                <CardDescription>{t("Monthly milk production and quality metrics")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] md:h-[400px]">
                  <MilkProductionStatsChart />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">{t("Production Metrics")}</h3>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Total Production")}:</span>
                      <span>72,450 {t("liters")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Average Per Cow")}:</span>
                      <span>19.2 {t("liters/day")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Peak Production")}:</span>
                      <span>32 {t("liters/day")}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">{t("Quality Metrics")}</h3>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Average Fat")}:</span>
                      <span>3.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Average Protein")}:</span>
                      <span>3.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Somatic Cell Count")}:</span>
                      <span>150,000 cells/ml</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">{t("Efficiency Metrics")}</h3>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Feed Conversion")}:</span>
                      <span>1.4 {t("kg feed/liter")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Cost Per Liter")}:</span>
                      <span>${farmStats.feedCostPerLiter}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Income Per Liter")}:</span>
                      <span>$0.42</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reproduction">
            <Card>
              <CardHeader>
                <CardTitle>{t("Reproduction Statistics")}</CardTitle>
                <CardDescription>{t("Breeding efficiency and reproductive health metrics")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] md:h-[400px]">
                  <ReproductionStatsChart />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">{t("Breeding Metrics")}</h3>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Pregnancy Rate")}:</span>
                      <span>{farmStats.pregnancyRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Conception Rate")}:</span>
                      <span>45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Services Per Conception")}:</span>
                      <span>1.8</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">{t("Calving Metrics")}</h3>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Calving Interval")}:</span>
                      <span>385 {t("days")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Days to First Service")}:</span>
                      <span>65 {t("days")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Calving Rate")}:</span>
                      <span>92%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">{t("Calf Metrics")}</h3>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Calf Mortality")}:</span>
                      <span>{farmStats.calfMortalityRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Female:Male Ratio")}:</span>
                      <span>52:48</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Twinning Rate")}:</span>
                      <span>3.5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health">
            <Card>
              <CardHeader>
                <CardTitle>{t("Health Statistics")}</CardTitle>
                <CardDescription>{t("Disease incidence and treatment effectiveness")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] md:h-[400px]">
                  <HealthStatsChart />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">{t("Disease Metrics")}</h3>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Disease Incidence")}:</span>
                      <span>{farmStats.diseaseIncidence}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Mastitis Cases")}:</span>
                      <span>12 {t("cases")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Lameness Cases")}:</span>
                      <span>8 {t("cases")}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">{t("Treatment Metrics")}</h3>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Treatment Success Rate")}:</span>
                      <span>92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Average Recovery Time")}:</span>
                      <span>5.2 {t("days")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Antibiotic Usage")}:</span>
                      <span>-12% {t("vs last year")}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">{t("Preventive Metrics")}</h3>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Vaccination Rate")}:</span>
                      <span>100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Hoof Trimming")}:</span>
                      <span>95%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Health Check Compliance")}:</span>
                      <span>98%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>{t("Financial Statistics")}</CardTitle>
                <CardDescription>{t("Profitability and cost analysis")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] md:h-[400px]">
                  <FinancialStatsChart />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">{t("Revenue Metrics")}</h3>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Total Revenue")}:</span>
                      <span>$125,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Revenue Per Cow")}:</span>
                      <span>$1,850</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Milk Price")}:</span>
                      <span>$0.42 / {t("liter")}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">{t("Cost Metrics")}</h3>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Total Expenses")}:</span>
                      <span>$85,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Feed Cost")}:</span>
                      <span>$35,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Labor Cost")}:</span>
                      <span>$20,000</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">{t("Profitability Metrics")}</h3>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Net Profit")}:</span>
                      <span>$40,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Profit Per Cow")}:</span>
                      <span>${farmStats.profitPerCow}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t("Profit Margin")}:</span>
                      <span>32%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

