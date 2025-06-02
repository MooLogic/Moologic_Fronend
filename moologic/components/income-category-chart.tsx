"use client"

import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"
import { useTranslation } from "@/components/providers/language-provider"
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

// Create API slice for income breakdown
export const incomeBreakdownApi = createApi({
  reducerPath: 'incomeBreakdownApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:8000/',
  }),
  endpoints: (builder) => ({
    getIncomeBreakdown: builder.query<{
      title: string;
      breakdown: { [key: string]: number };
      total_income: number;
      calculated_on: string;
    }, { accessToken: string; farmId: number }>({
      query: ({ accessToken, farmId }) => ({
        url: `financial/income/breakdown/${farmId}/`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
  }),
})

export const { useGetIncomeBreakdownQuery } = incomeBreakdownApi

// Define chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function IncomeCategoryChart() {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ""
  const farmId = 1 // Replace with actual farm ID from your app state

  const { data: breakdownData, isLoading } = useGetIncomeBreakdownQuery({
    accessToken,
    farmId,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <p>Loading...</p>
      </div>
    )
  }

  if (!breakdownData || !breakdownData.breakdown) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <p>No data available</p>
      </div>
    )
  }

  // Transform the breakdown data for the pie chart
  const chartData = Object.entries(breakdownData.breakdown).map(([category, percentage]) => ({
    name: category,
    value: percentage,
  }))

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{`${payload[0].value.toFixed(2)}%`}</p>
          <p className="text-sm text-gray-600">
            {`${t("Amount")}: ${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'ETB',
            }).format((breakdownData.total_income * payload[0].value) / 100)}`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-full">
      <div className="text-sm text-gray-500 mb-4">
        {t("Total Income")}: {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'ETB',
        }).format(breakdownData.total_income)}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

