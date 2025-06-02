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
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Create API slice for financial overview
export const financeOverviewApi = createApi({
  reducerPath: 'financeOverviewApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:8000/',
  }),
  endpoints: (builder) => ({
    getTotalIncome: builder.query<{ sum: number }, string>({
      query: (accessToken) => ({
        url: 'financial/income/total/',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
    getTotalExpense: builder.query<{ sum: number }, string>({
      query: (accessToken) => ({
        url: 'financial/expense/total/',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
    getProfitSnapshot: builder.query<{
      total_income: number;
      total_expense: number;
      net_profit: number;
    }, { accessToken: string; farmId: number }>({
      query: ({ accessToken, farmId }) => ({
        url: `financial/profit/snapshot/?farm_id=${farmId}`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
    getMonthlyFinanceSummary: builder.query<{
      month: string;
      income: number;
      expenses: number;
      cashFlow: number;
    }[], string>({
      query: (accessToken) => ({
        url: 'financial/monthly-summary/',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
  }),
})

export const {
  useGetTotalIncomeQuery,
  useGetTotalExpenseQuery,
  useGetProfitSnapshotQuery,
  useGetMonthlyFinanceSummaryQuery,
} = financeOverviewApi

export function FinanceOverview() {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ""
  const farmId = 1 // Replace with actual farm ID from your app state

  const { data: totalIncomeData, isLoading: isLoadingIncome } = useGetTotalIncomeQuery(accessToken)
  const { data: totalExpenseData, isLoading: isLoadingExpense } = useGetTotalExpenseQuery(accessToken)
  const { data: profitData, isLoading: isLoadingProfit } = useGetProfitSnapshotQuery({
    accessToken,
    farmId,
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
    }).format(amount)
  }

  // Calculate profit margin
  const calculateProfitMargin = () => {
    if (!profitData?.total_income || !profitData?.net_profit) return 0;
    return ((profitData.net_profit / profitData.total_income) * 100) || 0;
  };

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
            <div className="text-2xl font-bold">
              {isLoadingIncome ? (
                "Loading..."
              ) : (
                formatCurrency(totalIncomeData?.sum || 0)
              )}
            </div>
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
            <div className="text-2xl font-bold">
              {isLoadingExpense ? (
                "Loading..."
              ) : (
                formatCurrency(totalExpenseData?.sum || 0)
              )}
            </div>
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
            <div className={`text-2xl font-bold ${
              (profitData?.net_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {isLoadingProfit ? (
                "Loading..."
              ) : (
                formatCurrency(profitData?.net_profit || 0)
              )}
            </div>
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
            <div className="text-2xl font-bold">
              {isLoadingProfit ? "Loading..." : `${calculateProfitMargin().toFixed(2)}%`}
            </div>
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
    </div>
  )
}

