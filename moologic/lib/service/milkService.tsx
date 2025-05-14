import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import process from 'process';

interface MilkRecord {
  id?: number;
  cattle_tag: string;
  date: string;
  quantity: number;
  shift: string;
}

interface MilkProduction {
  date: string;
  total_production: number;
}

export const milkApi = createApi({
  reducerPath: 'milkApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.base_url || 'http://127.0.0.1:8000/',
  }),
  endpoints: (builder) => ({
    // Get all milk records
    getMilkRecords: builder.query<MilkRecord[], { accessToken: string }>({
      query: (data) => ({
        url: '/milk/milk-records/',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      }),
    }),

    // Get milk production by cattle ID
    getMilkProductionByCattle: builder.query<
      MilkRecord[],
      { accessToken: string; cattle_id: number }
    >({
      query: (data) => ({
        url: `/milk/milk-production/${data.cattle_id}/`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      }),
    }),

    // Get milk production by cattle for last 7 days
    getMilkProductionLast7Days: builder.query<
      MilkProduction[],
      { accessToken: string; cattle_id: number }
    >({
      query: (data) => ({
        url: `/milk/milk-production/last-7-days/${data.cattle_id}/`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      }),
    }),

    // Get milk production by cattle for last 30 days
    getMilkProductionLast30Days: builder.query<
      MilkProduction[],
      { accessToken: string; cattle_id: number }
    >({
      query: (data) => ({
        url: `/milk/milk-production/last-30-days/${data.cattle_id}/`,
        method: 'GET',
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
        url: `/milk/milk-production/last-90-days/${data.cattle_id}/`,
        method: 'GET',
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
        url: `/milk/milk-production/last-300-days/${data.cattle_id}/`,
        method: 'GET',
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
        url: '/milk/farm-production/last-7-days/',
        method: 'GET',
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
        url: '/milk/farm-production/last-30-days/',
        method: 'GET',
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
        url: '/milk/farm-production/last-90-days/',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      }),
    }),

    // Add new milk record
    addMilkRecord: builder.mutation<
      MilkRecord,
      { accessToken: string; cattle_tag: string; date: string; quantity: number; shift: string }
    >({
      query: (data) => ({
        url: '/milk/add-milk-record/',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: {
          cattle_tag: data.cattle_tag,
          date: data.date,
          quantity: data.quantity,
          shift: data.shift,
        },
      }),
    }),
  }),
});

export const {
  useGetMilkRecordsQuery,
  useGetMilkProductionByCattleQuery,
  useGetMilkProductionLast7DaysQuery,
  useGetMilkProductionLast30DaysQuery,
  useGetMilkProductionLast90DaysQuery,
  useGetMilkProductionLast300DaysQuery,
  useGetFarmProductionLast7DaysQuery,
  useGetFarmProductionLast30DaysQuery,
  useGetFarmProductionLast90DaysQuery,
  useAddMilkRecordMutation,
} = milkApi;