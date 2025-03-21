"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FinanceOverview } from "@/components/finance-overview"
import { IncomeExpenseRecords } from "@/components/income-expense-records"
import { BudgetManagement } from "@/components/budget-management"
import { useTranslation } from "@/components/providers/language-provider"

export function FinanceDashboard() {
  const { t } = useTranslation()

  return (
    <main className="flex-1">
      <header className="h-16 px-8 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-gray-800">{t("Finance Management")}</h1>
        <div className="text-lg font-medium text-gray-800">Anan Dairy Farm</div>
      </header>

      <div className="p-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-[600px] grid-cols-3 mb-8">
            <TabsTrigger value="overview">{t("Overview")}</TabsTrigger>
            <TabsTrigger value="records">{t("Income & Expenses")}</TabsTrigger>
            <TabsTrigger value="budget">{t("Budget Management")}</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <FinanceOverview />
          </TabsContent>
          <TabsContent value="records">
            <IncomeExpenseRecords />
          </TabsContent>
          <TabsContent value="budget">
            <BudgetManagement />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

