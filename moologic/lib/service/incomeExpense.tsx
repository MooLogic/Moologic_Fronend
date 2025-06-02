// lib/service/incomeExpenseService.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import process from 'process';

export const incomeExpenseApi = createApi({
  reducerPath: 'incomeExpenseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:8000/',
    prepareHeaders: (headers, { getState }) => {
      // Log headers for debugging
      console.log('Preparing headers:', Object.fromEntries(headers.entries()));
      return headers;
    },
  }),
  tagTypes: ['Income', 'Expense'],
  endpoints: (builder) => ({
    // Income endpoints
    createIncome: builder.mutation<
      {
        id: number;
        date: string;
        category_name: string;
        amount: number;
        description: string;
        recorded_by: number;
      },
      {
        accessToken: string;
        date: string;
        category_name: string;
        amount: number;
        description?: string;
        farm_id: number;
      }
    >({
      query: (data) => {
        // Log the request data for debugging
        console.log('Creating income with data:', data);
        
        const requestBody = {
          date: data.date,
          category_name: data.category_name,
          amount: data.amount,
          description: data.description,
          farm_id: data.farm_id,
        };

        // Log the final request configuration
        console.log('Request configuration:', {
          url: 'financial/income/create/',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: requestBody,
        });

        return {
          url: 'financial/income/create/',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: requestBody,
        };
      },
      transformErrorResponse: (response: { status: number; data: any }) => {
        console.log('Error response:', response);
        return response;
      },
      invalidatesTags: ['Income'],
    }),

    updateIncome: builder.mutation<
      any,
      {
        accessToken: string;
        income_id: number;
        category_name?: string;
        amount?: number;
        description?: string;
        farm_id: number;
      }
    >({
      query: (data) => ({
        url: `financial/income/update/${data.income_id}/`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: {
          category_name: data.category_name,
          amount: data.amount,
          description: data.description,
          farm_id: data.farm_id,
        },
      }),
      invalidatesTags: ['Income'],
    }),

    deleteIncome: builder.mutation<
      void,
      {
        accessToken: string;
        income_id: number;
      }
    >({
      query: (data) => ({
        url: `financial/income/delete/${data.income_id}/`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      }),
      invalidatesTags: ['Income'],
    }),

    listIncome: builder.query<any[], string>({
      query: (accessToken) => ({
        url: 'financial/income/list/',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      transformResponse: (response: any) => {
        console.log('List income response:', response);
        return response;
      },
      providesTags: ['Income'],
    }),

    // Expense endpoints
    createExpense: builder.mutation<
      {
        id: number;
        date: string;
        category_name: string;
        amount: number;
        description: string;
        recorded_by: number;
      },
      {
        accessToken: string;
        date: string;
        category_name: string;
        amount: number;
        description?: string;
        farm_id: number;
      }
    >({
      query: (data) => {
        console.log('Creating expense with data:', data);
        return {
          url: 'financial/expense/create/',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: {
            date: data.date,
            category_name: data.category_name,
            amount: data.amount,
            description: data.description,
            farm_id: data.farm_id,
          },
        };
      },
      transformErrorResponse: (response: { status: number; data: any }) => {
        console.log('Expense error response:', response);
        return response;
      },
      invalidatesTags: ['Expense'],
    }),

    updateExpense: builder.mutation<
      any,
      {
        accessToken: string;
        expense_id: number;
        category_name?: string;
        amount?: number;
        description?: string;
        farm_id: number;
      }
    >({
      query: (data) => ({
        url: `financial/expense/update/${data.expense_id}/`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: {
          category_name: data.category_name,
          amount: data.amount,
          description: data.description,
          farm_id: data.farm_id,
        },
      }),
      invalidatesTags: ['Expense'],
    }),

    deleteExpense: builder.mutation<
      void,
      {
        accessToken: string;
        expense_id: number;
      }
    >({
      query: (data) => ({
        url: `financial/expense/delete/${data.expense_id}/`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      }),
      invalidatesTags: ['Expense'],
    }),

    listExpense: builder.query<any[], string>({
      query: (accessToken) => ({
        url: 'financial/expense/list/',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      providesTags: ['Expense'],
    }),
  }),
});

export const {
  useCreateIncomeMutation,
  useUpdateIncomeMutation,
  useDeleteIncomeMutation,
  useListIncomeQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useListExpenseQuery,
} = incomeExpenseApi;