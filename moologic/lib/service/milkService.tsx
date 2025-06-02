import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from '@/lib/constants';
import { getSession } from "next-auth/react";
import process from "process";

interface LactatingCattle {
  id: number;
  ear_tag_no: string;
  name: string;
  milking_frequency: number;
  last_milking: string | null;
  can_milk_now: boolean;
}

interface MilkRecord {
  id?: number;
  cattle_tag: string;
  ear_tag_no: string;
  quantity: number;
  date: string;
  time: string;
  shift: string;
  created_at?: string;
  updated_at?: string;
}

interface MilkProduction {
  date: string;
  total_production: number;
  estimated_production?: number;
  shift?: string;
}

interface TodayProductionStats {
  total_production: number;
  records_count: number;
  active_milking_cattle: number;
}

// Helper function to get error message
const getErrorMessage = (response: any): string => {
  if (!response) return 'An error occurred';
  if (typeof response === 'string') return response;
  
  const data = response.data || {};
  return data.error || data.message || data.detail || 'An error occurred';
};

export const milkApi = createApi({
  reducerPath: "milkApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}milk/`,
  }),
  tagTypes: ['MilkRecords', 'LactatingCattle'],
  endpoints: (builder) => ({
    // Get all milk records
    getMilkRecords: builder.query<MilkRecord[], string>({
      query: (token) => ({
        url: 'milk-records/',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['MilkRecords'],
    }),

    // Get lactating cattle
    getLactatingCattle: builder.query<LactatingCattle[], string>({
      query: (token) => ({
        url: 'lactating-cattle/',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['LactatingCattle'],
    }),

    // Get milk production by cattle ID
    getMilkProductionByCattle: builder.query<
      MilkRecord[],
      { accessToken: string; cattle_id: number }
    >({
      query: (data) => ({
        url: `/milk-production/${data.cattle_id}/`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      }),
      transformErrorResponse: (response: any) => ({
        status: response.status,
        message: getErrorMessage(response),
      }),
    }),

    // Get milk production by cattle for last 7 days
    getMilkProductionLast7Days: builder.query<
      MilkProduction[],
      { accessToken: string; cattle_id: number }
    >({
      query: (data) => ({
        url: `/milk-production/last-7-days/${data.cattle_id}/`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      }),
      transformErrorResponse: (response: any) => ({
        status: response.status,
        message: getErrorMessage(response),
      }),
    }),

    // Get milk production by cattle for last 30 days
    getMilkProductionLast30Days: builder.query<
      MilkProduction[],
      { accessToken: string; cattle_id: number }
    >({
      query: (data) => ({
        url: `/milk-production/last-30-days/${data.cattle_id}/`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      }),
    }),

    // Get milk production by cattle for last 90 days
    getMilkProductionLast90Days: builder.query<
      MilkProduction[],
      { accessToken: string; cattle_id: number }
    >({
      query: (data) => ({
        url: `/milk-production/last-90-days/${data.cattle_id}/`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      }),
    }),

    // Get milk production by cattle for last 300 days
    getMilkProductionLast300Days: builder.query<
      MilkProduction[],
      { accessToken: string; cattle_id: number }
    >({
      query: (data) => ({
        url: `/milk-production/last-300-days/${data.cattle_id}/`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      }),
    }),

    // Get farm production for last 7 days
    getFarmProductionLast7Days: builder.query<
      MilkProduction[],
      { accessToken: string }
    >({
      query: (data) => ({
        url: "/farm-production/last-7-days/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      }),
    }),

    // Get farm production for last 30 days
    getFarmProductionLast30Days: builder.query<
      MilkProduction[],
      { accessToken: string }
    >({
      query: (data) => ({
        url: "/farm-production/last-30-days/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      }),
    }),

    // Get farm production for last 90 days
    getFarmProductionLast90Days: builder.query<
      MilkProduction[],
      { accessToken: string }
    >({
      query: (data) => ({
        url: "/farm-production/last-90-days/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      }),
    }),

    // Get today's production stats
    getTodayProductionStats: builder.query<TodayProductionStats, string>({
      query: (token) => ({
        url: 'today-production-stats/',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['MilkRecords'],
    }),

    // Add new milk record
    addMilkRecord: builder.mutation<MilkRecord, { token: string; data: Partial<MilkRecord> }>({
      query: ({ token, data }) => ({
        url: 'add-milk-record/',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
      invalidatesTags: ['MilkRecords', 'LactatingCattle'],
    }),

    //edit milk record
    editMilkRecord: builder.mutation<
      MilkRecord,
      {
        accessToken: string;
        id: number;
        cattle_tag: string;
        quantity: number;
        shift: string;
      }
    >({
      query: (data) => ({
        url: `/update-milk-record/${data.id}/`,  // Fixed URL format
        method: "PUT",
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
          "Content-Type": "application/json",
        },
        body: {
          cattle_tag: data.cattle_tag,
          quantity: data.quantity,
          shift: data.shift,
        },
      }),
      invalidatesTags: ['MilkRecords'],
      transformErrorResponse: (response: any) => ({
        status: response.status,
        message: getErrorMessage(response),
      }),
    }),

    // Delete milk record
    deleteMilkRecord: builder.mutation<void, { token: string; id: number }>({
      query: ({ token, id }) => ({
        url: `delete-milk-record/${id}/`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['MilkRecords'],
    }),

    // Update milk record
    updateMilkRecord: builder.mutation<MilkRecord, { token: string; id: number; data: Partial<MilkRecord> }>({
      query: ({ token, id, data }) => ({
        url: `update-milk-record/${id}/`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
      invalidatesTags: ['MilkRecords', 'LactatingCattle'],
    }),
  }),
});

export const {
  useGetMilkRecordsQuery,
  useGetLactatingCattleQuery,
  useGetMilkProductionByCattleQuery,
  useGetMilkProductionLast7DaysQuery,
  useGetMilkProductionLast30DaysQuery,
  useGetMilkProductionLast90DaysQuery,
  useGetMilkProductionLast300DaysQuery,
  useGetFarmProductionLast7DaysQuery,
  useGetFarmProductionLast30DaysQuery,
  useGetFarmProductionLast90DaysQuery,
  useGetTodayProductionStatsQuery,
  useAddMilkRecordMutation,
  useEditMilkRecordMutation,
  useDeleteMilkRecordMutation,
  useUpdateMilkRecordMutation,
} = milkApi;
