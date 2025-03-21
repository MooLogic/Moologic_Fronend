"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp } from "lucide-react"
import { FinanceSummaryChart } from "@/components/finance-summary-chart"
import { ExpenseCategoryChart } from "@/components/expense-category-chart"
import { IncomeCategoryChart } from "@/components/income-category-chart"
import { CashFlowChart } from "@/components/cash-flow-chart"
import { useTranslation } from "@/components/providers/language-provider"

export function FinanceOverview() {
  const { t } = useTranslation()

  // Sample financial data
  const financialData = {
    totalIncome: 125000,
    totalExpenses: 85000,
    netProfit: 40000,
    profitMargin: 32,
    cashOnHand: 65000,
    pendingPayments: 12000,
    pendingReceipts: 8000,
  }

  return (
    <div className="space-y-6">
      {/* Filter and Date Range */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <DateRangePicker />
        <Button variant="outline" className="ml-auto gap-2">
          <Download className="h-4 w-4" />
          {t("Export Report")}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{t("Total Income")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData.totalIncome.toLocaleString()}</div>
            <div className="flex items-center mt-1 text-green-600 text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+8% {t("from last period")}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{t("Total Expenses")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData.totalExpenses.toLocaleString()}</div>
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+5% {t("from last period")}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{t("Net Profit")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData.netProfit.toLocaleString()}</div>
            <div className="flex items-center mt-1 text-green-600 text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+15% {t("from last period")}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{t("Profit Margin")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialData.profitMargin}%</div>
            <div className="flex items-center mt-1 text-green-600 text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+3% {t("from last period")}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Income vs Expenses")}</CardTitle>
            <CardDescription>{t("Monthly comparison for the current year")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <FinanceSummaryChart />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("Cash Flow")}</CardTitle>
            <CardDescription>{t("Monthly cash flow for the current year")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <CashFlowChart />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Expense Categories")}</CardTitle>
            <CardDescription>{t("Breakdown of expenses by category")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ExpenseCategoryChart />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("Income Sources")}</CardTitle>
            <CardDescription>{t("Breakdown of income by source")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <IncomeCategoryChart />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Financial Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Cash on Hand")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData.cashOnHand.toLocaleString()}</div>
            <p className="text-sm text-gray-500 mt-2">{t("Available cash for operations")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("Pending Payments")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData.pendingPayments.toLocaleString()}</div>
            <p className="text-sm text-gray-500 mt-2">{t("Upcoming expenses to be paid")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("Pending Receipts")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData.pendingReceipts.toLocaleString()}</div>
            <p className="text-sm text-gray-500 mt-2">{t("Expected income to be received")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

