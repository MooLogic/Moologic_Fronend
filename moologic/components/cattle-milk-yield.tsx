"use client"

import { useState, useMemo } from "react"
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
import { useSession } from "next-auth/react"
import { format } from "date-fns"
import { useGetMilkRecordsQuery } from "@/lib/service/milkService"
import { useGetCattleByIdQuery } from "@/lib/service/cattleService"
import { MilkYieldReport } from "@/components/milk-yield-report"

interface CattleMilkYieldProps {
  cattleId: string
}

interface MilkRecord {
  id: number
  ear_tag_no: string
  quantity: number
  date: string
  time: string
  shift: "morning" | "evening"
  fat_percentage?: number
  protein_percentage?: number
  lactose_percentage?: number
  somatic_cell_count?: number
  notes?: string
}

interface CattleData {
  id: string
  name?: string
  ear_tag_no: string
  lactation_number: number
  days_in_milk: number
  current_lactation_total: number
  average_daily_yield: number
  peak_yield: number
  last_recorded_yield: number
  fat_percentage?: number
  protein_percentage?: number
  lactose_percentage?: number
  somatic_cell_count?: number
}

interface MilkStats {
  currentLactationTotal: number;
  averageDailyYield: number;
  peakYield: number;
  lastRecordedYield: number;
  daysInMilk: number;
  peakDay: number;
  persistency: number;
}

export function CattleMilkYield({ cattleId }: CattleMilkYieldProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const { data: session } = useSession()
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>()
  
  const accessToken = session?.user?.accessToken || ""
  
  // Fetch cattle details
  const { data: cattleDetails, isLoading: isLoadingCattle } = useGetCattleByIdQuery(
    { accessToken, id: cattleId },
    { skip: !accessToken }
  )
  
  // Fetch all milk records
  const { data: allMilkRecords, isLoading: isLoadingMilkYield } = useGetMilkRecordsQuery(
    accessToken,
    { skip: !accessToken }
  )

  // Filter milk records for the specific cattle
  const milkYieldData = useMemo(() => {
    if (!allMilkRecords || !cattleDetails?.ear_tag_no) return [];
    
    return allMilkRecords
      .filter(record => record.ear_tag_no === cattleDetails.ear_tag_no)
      .filter(record => {
        if (!dateRange) return true;
        const recordDate = new Date(record.date);
        const fromDate = dateRange.from;
        const toDate = dateRange.to;
        return recordDate >= fromDate && recordDate <= toDate;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allMilkRecords, cattleDetails?.ear_tag_no, dateRange]);

  // Get the earliest record date as lactation start
  const lactationStartDate = useMemo(() => {
    if (milkYieldData.length === 0) return new Date();
    return milkYieldData.reduce((earliest, record) => {
      const recordDate = new Date(record.date);
      return recordDate < earliest ? recordDate : earliest;
    }, new Date(milkYieldData[0].date));
  }, [milkYieldData]);

  // Calculate daily totals
  const dailyTotals = useMemo(() => {
    const totals: { [date: string]: number } = {};
    milkYieldData.forEach(record => {
      const date = record.date.split('T')[0];
      totals[date] = (totals[date] || 0) + record.quantity;
    });
    return totals;
  }, [milkYieldData]);

  // Calculate current statistics
  const currentStats = useMemo<MilkStats>(() => {
    const defaultStats: MilkStats = {
      currentLactationTotal: 0,
      averageDailyYield: 0,
      peakYield: 0,
      lastRecordedYield: 0,
      daysInMilk: 0,
      peakDay: 0,
      persistency: 0
    };

    if (!milkYieldData || milkYieldData.length === 0) {
      return defaultStats;
    }

    try {
      const totalProduction = Number(milkYieldData.reduce((sum, record) => sum + (Number(record.quantity) || 0), 0));
      const uniqueDays = Math.max(Object.keys(dailyTotals).length, 1);
      const dailyValues = Object.entries(dailyTotals).map(([date, value]) => ({
        date: new Date(date),
        value: Number(value) || 0
      }));
      
      // Sort by value to find peak
      const sortedByValue = [...dailyValues].sort((a, b) => b.value - a.value);
      const peakValue = sortedByValue[0]?.value || 0;
      
      // Find the earliest day with peak value
      const peakDay = dailyValues.find(day => day.value === peakValue);
      const daysInMilk = Math.ceil((new Date().getTime() - lactationStartDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Calculate persistency (production at day 60 / peak production * 100)
      const day60 = new Date(lactationStartDate.getTime() + (60 * 24 * 60 * 60 * 1000));
      const production60 = dailyValues.find(day => 
        Math.abs(day.date.getTime() - day60.getTime()) < 24 * 60 * 60 * 1000
      )?.value || 0;
      
      const persistency = peakValue > 0 ? (production60 / peakValue) * 100 : 0;
      
      return {
        currentLactationTotal: Number(totalProduction) || 0,
        averageDailyYield: Number(totalProduction / uniqueDays) || 0,
        peakYield: peakValue,
        lastRecordedYield: Number(milkYieldData[0]?.quantity) || 0,
        daysInMilk: Number(daysInMilk) || 0,
        peakDay: peakDay ? Math.ceil((peakDay.date.getTime() - lactationStartDate.getTime()) / (1000 * 60 * 60 * 24)) : 0,
        persistency: Number(persistency.toFixed(1)) || 0
      };
    } catch (error) {
      console.error('Error calculating milk stats:', error);
      return defaultStats;
    }
  }, [milkYieldData, dailyTotals, lactationStartDate]);

  // Calculate Woods model parameters for lactation curve
  const calculateWoodsModel = (days: number) => {
    const a = 20 // peak production
    const b = 0.05 // rate of increase to peak
    const c = 0.003 // rate of decline after peak
    return a * Math.pow(days, b) * Math.exp(-c * days)
  }

  // Prepare data for lactation curve
  const lactationCurveData = useMemo(() => 
    Array.from({ length: 305 }, (_, i) => {
      const day = i + 1;
      const dayFromStart = Math.ceil((new Date().getTime() - lactationStartDate.getTime()) / (1000 * 60 * 60 * 24));
      const recordsForDay = milkYieldData.filter(record => {
        const recordDate = new Date(record.date);
        const daysSinceStart = Math.ceil((recordDate.getTime() - lactationStartDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceStart === day;
      });
      const dailyTotal = recordsForDay.reduce((sum, record) => sum + record.quantity, 0);

      return {
        day,
        expected: calculateWoodsModel(day),
        actual: recordsForDay.length > 0 ? dailyTotal : null
      };
    }), [milkYieldData, lactationStartDate]);

  // Group records by date for the table
  const groupedRecords = useMemo(() => 
    milkYieldData.reduce((acc, record) => {
      const date = record.date.split('T')[0];
      if (!acc[date]) {
        acc[date] = { 
          morning: 0, 
          evening: 0, 
          fat: null, 
          protein: null, 
          notes: '' 
        };
      }
      if (record.shift === 'morning') {
        acc[date].morning = Number(record.quantity) || 0;
      } else {
        acc[date].evening = Number(record.quantity) || 0;
      }
      if (record.fat_percentage) acc[date].fat = Number(record.fat_percentage);
      if (record.protein_percentage) acc[date].protein = Number(record.protein_percentage);
      if (record.notes) acc[date].notes = record.notes;
      return acc;
    }, {} as Record<string, { 
      morning: number; 
      evening: number; 
      fat: number | null; 
      protein: number | null; 
      notes: string 
    }>),
    [milkYieldData]
  );

  if (isLoadingCattle || isLoadingMilkYield) {
    return <div className="p-8">Loading...</div>
  }

  if (!cattleDetails) {
    return <div className="p-8">Cattle not found</div>
  }

  return (
    <main className="flex-1">
      <header className="h-16 px-8 flex items-center border-b border-gray-100 bg-white sticky top-0 z-10">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/milk-yield")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            {t("Milk Yield")} - {cattleDetails.ear_tag_no} {cattleDetails.name && `(${cattleDetails.name})`}
          </h1>
          <p className="text-sm text-gray-500">
            {t("Lactation")} #{cattleDetails.lactation_number} • {currentStats.daysInMilk} {t("days in milk")}
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
                {Number(currentStats.currentLactationTotal).toFixed(1)} {t("liters")}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{t("Peak Yield")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Number(currentStats.peakYield).toFixed(1)} {t("liters")}
              </div>
              <div className="text-sm text-gray-500">
                {t("Day")} {currentStats.peakDay}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{t("Persistency")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentStats.persistency}%
              </div>
              <div className="text-sm text-gray-500">
                {t("at 60 days")}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{t("Average Daily Yield")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Number(currentStats.averageDailyYield).toFixed(1)} {t("liters")}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter and Date Range */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <DateRangePicker 
            value={dateRange}
            onChange={setDateRange}
          />
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="ml-auto gap-2">
            <Download className="h-4 w-4" />
            <MilkYieldReport
              data={{
                milkRecords: milkYieldData || [],
                totalProduction: currentStats.currentLactationTotal,
                averageDaily: currentStats.averageDailyYield,
                activeCattle: 1,
                efficiency: (currentStats.averageDailyYield / calculateWoodsModel(currentStats.daysInMilk)) * 100,
                periodStart: dateRange?.from?.toISOString(),
                periodEnd: dateRange?.to?.toISOString(),
                peakProduction: currentStats.peakYield,
                productionTrend: 0 // Calculate trend
              }}
            />
          </Button>
        </div>

        {/* Charts Tabs */}
        <Tabs defaultValue="lactation" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="lactation">{t("Lactation Curve")}</TabsTrigger>
            <TabsTrigger value="trend">{t("Production Trend")}</TabsTrigger>
          </TabsList>
          <TabsContent value="lactation">
            <Card>
              <CardHeader>
                <CardTitle>{t("Lactation Curve")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <LactationCurveChart data={lactationCurveData} />
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
                  <MilkProductionTrendChart data={milkYieldData || []} />
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
                  {Object.entries(groupedRecords || {}).map(([date, record]) => (
                    <tr key={date} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{format(new Date(date), "yyyy-MM-dd")}</td>
                      <td className="py-3 px-4">{Number(record.morning).toFixed(1)}</td>
                      <td className="py-3 px-4">{Number(record.evening).toFixed(1)}</td>
                      <td className="py-3 px-4 font-medium">
                        {(Number(record.morning) + Number(record.evening)).toFixed(1)}
                      </td>
                      <td className="py-3 px-4">
                        {record.fat !== null ? Number(record.fat).toFixed(1) : "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {record.protein !== null ? Number(record.protein).toFixed(1) : "N/A"}
                      </td>
                      <td className="py-3 px-4 text-gray-500">{record.notes || "-"}</td>
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

