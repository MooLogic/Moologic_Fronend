import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/lib/constants';

export interface InseminationRecord {
  id: string;
  cattle: {
    id: string;
    ear_tag_no: string;
  };
  bull_id?: string;
  insemination_method: 'natural' | 'artificial';
  insemination_status: 'pending' | 'successful' | 'failed';
  insemination_date: string;
  pregnancy_check_date?: string;
  pregnancy_check_status: 'pending' | 'confirmed' | 'negative';
  expected_calving_date?: string;
  pregnancy_check_reminder_sent: boolean;
  notes?: string;
}

// Helper function to get error message from response
const getErrorMessage = (response: any): string => {
    if (!response) return 'An error occurred';
    if (typeof response === 'string') return response;
    
    const data = response.data || {};
    return data.error || data.message || data.detail || 'An error occurred';
};

export const inseminationApi = createApi({
  reducerPath: 'inseminationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  tagTypes: ['Insemination'],
  endpoints: (builder) => ({
    getInseminations: builder.query<{ count: number; results: InseminationRecord[] }, { accessToken: string }>({
      query: (data) => ({
        url: '/core/inseminations/',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      }),
      providesTags: ['Insemination'],
      transformErrorResponse: (response: any) => ({
        status: response.status,
        message: getErrorMessage(response),
      }),
    }),
    getPendingPregnancyChecks: builder.query<InseminationRecord[], { accessToken: string }>({
      query: (data) => ({
        url: '/core/inseminations/pending-checks/',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      }),
      providesTags: ['Insemination'],
      transformErrorResponse: (response: any) => ({
        status: response.status,
        message: getErrorMessage(response),
      }),
    }),
    postInsemination: builder.mutation({
      query: (data: {
        accessToken: string;
        cattle_id: string;
        insemination_date: string;
        bull_id?: string;
        insemination_method: string;
        notes?: string;
      }) => ({
        url: '/core/inseminations/create/',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: {
          cattle: data.cattle_id,
          insemination_date: data.insemination_date,
          bull_id: data.bull_id,
          insemination_method: data.insemination_method,
          notes: data.notes,
        },
      }),
      transformErrorResponse: (response: any) => ({
        status: response.status,
        message: getErrorMessage(response),
      }),
      invalidatesTags: ['Insemination'],
    }),
    updateInsemination: builder.mutation({
      query: (data: {
        accessToken: string;
        id: string;
        pregnancy_check_date?: string;
        pregnancy_check_status?: string;
        notes?: string;
      }) => ({
        url: `/core/inseminations/${data.id}/`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: {
          pregnancy_check_date: data.pregnancy_check_date,
          pregnancy_check_status: data.pregnancy_check_status,
          notes: data.notes,
        },
      }),
      transformErrorResponse: (response: any) => ({
        status: response.status,
        message: getErrorMessage(response),
      }),
      invalidatesTags: ['Insemination'],
    }),
    deleteInsemination: builder.mutation({
      query: (data: { accessToken: string; id: string }) => ({
        url: `/core/inseminations/${data.id}/delete/`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      }),
      invalidatesTags: ['Insemination'],
    }),
  }),
});

export const {
  useGetInseminationsQuery,
  useGetPendingPregnancyChecksQuery,
  usePostInseminationMutation,
  useUpdateInseminationMutation,
  useDeleteInseminationMutation,
} = inseminationApi;