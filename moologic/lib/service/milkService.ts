import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface MilkRecord {
  id: number;
  ear_tag_no: string;
  quantity: number;
  date: string;
  time: string;
  shift: string;
}

interface ProductionRecord {
  date: string;
  total_production: number;
  estimated_production: number;
}

interface TodayStats {
  total_production: number;
  active_milking_cattle: number;
  records_count: number;
}

// Woods model parameters
const WOODS_PARAMS = {
  a: 20, // Scale parameter (peak production)
  b: 0.05, // Rate of increase to peak
  c: 0.003, // Rate of decline after peak
}

// Calculate estimated production using Woods model
const calculateWoodsModel = (daysInMilk: number) => {
  const { a, b, c } = WOODS_PARAMS;
  return a * Math.pow(daysInMilk, b) * Math.exp(-c * daysInMilk);
};

export const milkService = createApi({
  reducerPath: 'milkApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/milk/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    getMilkRecords: builder.query<MilkRecord[], string>({
      query: (accessToken) => ({
        url: 'milk-records/',
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }),
    getFarmProductionLast7Days: builder.query<ProductionRecord[], { accessToken: string }>({
      query: ({ accessToken }) => ({
        url: 'farm-production/last-7-days/',
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      transformResponse: (response: ProductionRecord[]) => {
        return response.map(record => ({
          ...record,
          estimated_production: calculateEstimatedProduction(record.date)
        }));
      }
    }),
    getFarmProductionLast30Days: builder.query<ProductionRecord[], { accessToken: string }>({
      query: ({ accessToken }) => ({
        url: 'farm-production/last-30-days/',
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      transformResponse: (response: ProductionRecord[]) => {
        return response.map(record => ({
          ...record,
          estimated_production: calculateEstimatedProduction(record.date)
        }));
      }
    }),
    getFarmProductionLast90Days: builder.query<ProductionRecord[], { accessToken: string }>({
      query: ({ accessToken }) => ({
        url: 'farm-production/last-90-days/',
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      transformResponse: (response: ProductionRecord[]) => {
        return response.map(record => ({
          ...record,
          estimated_production: calculateEstimatedProduction(record.date)
        }));
      }
    }),
    getTodayProductionStats: builder.query<TodayStats, string>({
      query: (accessToken) => ({
        url: 'today-production-stats/',
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }),
  }),
})

// Helper function to calculate estimated production for a given date
function calculateEstimatedProduction(date: string) {
  // This is a placeholder implementation
  // In a real application, you would:
  // 1. Get the lactating cattle for this date
  // 2. For each cow, calculate their expected production using Woods model based on their DIM
  // 3. Sum up all expected productions
  
  // For now, we'll return a reasonable estimate based on typical farm production
  return 25.0; // Example: 25 liters per cow per day
}

export const {
  useGetMilkRecordsQuery,
  useGetFarmProductionLast7DaysQuery,
  useGetFarmProductionLast30DaysQuery,
  useGetFarmProductionLast90DaysQuery,
  useGetTodayProductionStatsQuery,
} = milkService 