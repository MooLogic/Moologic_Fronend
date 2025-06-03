import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const governmentDashboardApi = createApi({
  reducerPath: 'governmentDashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:8000/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    // Farm statistics (core app)
    getNationalFarmStats: builder.query({
      query: ({ token }) => ({
        url: 'core/government/farm/stats/',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
    }),

    // Health statistics (core app)
    getNationalHealthStats: builder.query({
      query: ({ token }) => ({
        url: 'core/government/health/stats/',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
    }),

    // Reproduction statistics (core app)
    getNationalReproductionStats: builder.query({
      query: ({ token }) => ({
        url: 'core/government/reproduction/stats/',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
    }),

    // Milk production statistics (milk_tracker app)
    getNationalMilkProduction: builder.query({
      query: ({ token }) => ({
        url: 'milk/government/production/',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
    }),

    // Milking statistics (milk_tracker app)
    getNationalMilkingStats: builder.query({
      query: ({ token }) => ({
        url: 'milk/government/milking-stats/',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
    }),

    // Financial statistics (finance_tracker app)
    getNationalFinanceStats: builder.query({
      query: ({ token }) => ({
        url: 'financial/government/stats/',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
    }),

    // Expense categories (finance_tracker app)
    getNationalExpenseCategories: builder.query({
      query: ({ token }) => ({
        url: 'financial/government/expense-categories/',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
    }),
  }),
})

export const {
  useGetNationalFarmStatsQuery,
  useGetNationalHealthStatsQuery,
  useGetNationalReproductionStatsQuery,
  useGetNationalMilkProductionQuery,
  useGetNationalMilkingStatsQuery,
  useGetNationalFinanceStatsQuery,
  useGetNationalExpenseCategoriesQuery,
} = governmentDashboardApi
