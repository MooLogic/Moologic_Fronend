import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import process from 'process';

export const inseminationApi = createApi({
  reducerPath: 'inseminationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.base_url || 'http://127.0.0.1:8000/',
  }),
  endpoints: (builder) => ({
    getInseminations: builder.query({
      query: (data: { accessToken: string }) => ({
        url: '/core/inseminations/',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      }),
    }),
    getInseminationById: builder.query({
      query: (data: { accessToken: string; id: string }) => ({
        url: `/core/inseminations/${data.id}/`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      }),
    }),
    postInsemination: builder.mutation({
      query: (data: {
        accessToken: string;
        cattle_id: string;
        insemination_date: string;
        bull_id?: string;
        insemination_method: string;
        insemination_status: string;
        insemination_type: string;
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
          insemination_status: data.insemination_status,
          insemination_type: data.insemination_type,
          notes: data.notes,
        },
      }),
    }),
    updateInsemination: builder.mutation({
      query: (data: {
        accessToken: string;
        id: string;
        cattle_id: string;
        insemination_date: string;
        bull_id?: string;
        insemination_method: string;
        insemination_status: string;
        insemination_type: string;
        notes?: string;
      }) => ({
        url: `/core/inseminations/${data.id}/update/`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: {
          cattle: data.cattle_id,
          insemination_date: data.insemination_date,
          bull_id: data.bull_id,
          insemination_method: data.insemination_method,
          insemination_status: data.insemination_status,
          insemination_type: data.insemination_type,
          notes: data.notes,
        },
      }),
    }),
    partialUpdateInsemination: builder.mutation({
      query: (data: {
        accessToken: string;
        id: string;
        cattle_id?: string;
        insemination_date?: string;
        bull_id?: string;
        insemination_method?: string;
        insemination_status?: string;
        insemination_type?: string;
        notes?: string;
      }) => ({
        url: `/core/inseminations/${data.id}/partial-update/`,
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: {
          cattle: data.cattle_id,
          insemination_date: data.insemination_date,
          bull_id: data.bull_id,
          insemination_method: data.insemination_method,
          insemination_status: data.insemination_status,
          insemination_type: data.insemination_type,
          notes: data.notes,
        },
      }),
    }),
    deleteInsemination: builder.mutation({
      query: (data: { accessToken: string; id: string }) => ({
        url: `/core/inseminations/${data.id}/delete/`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      }),
    }),
  }),
});

export const {
  useGetInseminationsQuery,
  useGetInseminationByIdQuery,
  usePostInseminationMutation,
  useUpdateInseminationMutation,
  usePartialUpdateInseminationMutation,
  useDeleteInseminationMutation,
} = inseminationApi;