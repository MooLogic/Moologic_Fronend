import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Cattle {
  id: number;
  ear_tag_no: string;
  expected_calving_date?: string;
}

interface CattleResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Cattle[];
}

// Birth Record interfaces
interface BirthRecord {
  id: number;
  cattle: {
    id: number;
    ear_tag_no: string;
  };
  calving_date: string;
  calving_outcome: 'successful' | 'complications' | 'stillborn' | 'died_shortly_after';
  calf_count: number;
  calf_gender: string;
  calf_weight: string;
  calf_ear_tag: string;
  complications?: string;
  veterinary_assistance: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface BirthRecordResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BirthRecord[];
}

export const cattleApi = createApi({
  reducerPath: 'cattleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  tagTypes: ['BirthRecords', 'Cattle'],
  endpoints: (builder) => ({
    getPregnantCattle: builder.query<CattleResponse, { accessToken: string }>({
      query: ({ accessToken }) => ({
        url: 'core/cattle/pregnant/',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      providesTags: ['Cattle'],
    }),
    // Get birth records
    getBirthRecords: builder.query<BirthRecordResponse, { accessToken: string }>({
      query: ({ accessToken }) => ({
        url: 'core/birth-records/',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      providesTags: ['BirthRecords'],
    }),

    // Create birth record
    createBirthRecord: builder.mutation<BirthRecord, {
      accessToken: string;
      cattle: string;
      calving_date: string;
      calving_outcome: string;
      calf_count: number;
      calf_gender: string;
      calf_weight: string;
      calf_ear_tag: string;
      complications?: string;
      veterinary_assistance: boolean;
      notes?: string;
    }>({
      query: (data) => ({
        url: 'core/birth-records/',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: {
          cattle: data.cattle,
          calving_date: data.calving_date,
          calving_outcome: data.calving_outcome,
          calf_count: data.calf_count,
          calf_gender: data.calf_gender,
          calf_weight: data.calf_weight,
          calf_ear_tag: data.calf_ear_tag,
          complications: data.complications,
          veterinary_assistance: data.veterinary_assistance,
          notes: data.notes,
        },
      }),
      invalidatesTags: ['BirthRecords', 'Cattle'],
    }),

    // Update birth record
    updateBirthRecord: builder.mutation<BirthRecord, {
      accessToken: string;
      id: number;
      cattle: string;
      calving_date: string;
      calving_outcome: string;
      calf_count: number;
      calf_gender: string;
      calf_weight: string;
      calf_ear_tag: string;
      complications?: string;
      veterinary_assistance: boolean;
      notes?: string;
    }>({
      query: (data) => ({
        url: `core/birth-records/${data.id}/`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: {
          cattle: data.cattle,
          calving_date: data.calving_date,
          calving_outcome: data.calving_outcome,
          calf_count: data.calf_count,
          calf_gender: data.calf_gender,
          calf_weight: data.calf_weight,
          calf_ear_tag: data.calf_ear_tag,
          complications: data.complications,
          veterinary_assistance: data.veterinary_assistance,
          notes: data.notes,
        },
      }),
      invalidatesTags: ['BirthRecords', 'Cattle'],
    }),

    // Delete birth record
    deleteBirthRecord: builder.mutation<void, { accessToken: string; id: number }>({
      query: ({ accessToken, id }) => ({
        url: `core/birth-records/${id}/`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      invalidatesTags: ['BirthRecords', 'Cattle'],
    }),
  }),
});

export const {
  useGetLactatingCattleQuery,
  useGetPregnantCattleQuery,
  useGetBirthRecordsQuery,
  useCreateBirthRecordMutation,
  useUpdateBirthRecordMutation,
  useDeleteBirthRecordMutation,
} = cattleApi; 