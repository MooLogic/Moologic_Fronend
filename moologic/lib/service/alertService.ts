import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API_BASE_URL } from "@/lib/constants"

export interface Alert {
  id: number
  title: string
  description: string
  date: string
  type: 'health' | 'reproduction' | 'production' | 'inventory' | 'financial' | 'maintenance'
  priority: 'high' | 'medium' | 'low'
  read: boolean
  source_type: string
  source_id: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface AlertSettings {
  id: number
  category: string
  type: string
  enabled: boolean
  user_id: string
}

export interface AlertResponse {
  count: number
  results: Alert[]
}

export interface UpdateAlertRequest {
  read?: boolean
}

export const alertApi = createApi({
  reducerPath: "alertApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL + "core",
    prepareHeaders: (headers, { getState }) => {
      // The token will be injected by the useSession hook in the components
      return headers
    },
  }),
  tagTypes: ["Alerts"],
  endpoints: (builder) => ({
    getAlerts: builder.query<Alert[], { token: string; type?: string; read?: boolean; priority?: string }>({
      query: ({ token, type, read, priority }) => {
        const params = new URLSearchParams()
        if (type) params.append('type', type)
        if (read !== undefined) params.append('read', read.toString())
        if (priority) params.append('priority', priority)

        return {
          url: `/alerts/?${params.toString()}`,
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      },
      transformResponse: (response: AlertResponse) => response.results || [],
      providesTags: ["Alerts"],
    }),

    getUnreadAlerts: builder.query<Alert[], { token: string }>({
      query: ({ token }) => ({
        url: "/alerts/unread/",
        headers: {
          authorization: `Bearer ${token}`
        }
      }),
      transformResponse: (response: AlertResponse) => response.results || [],
      providesTags: ["Alerts"],
    }),

    getAlertsByType: builder.query<Alert[], { type: string; token: string }>({
      query: ({ type, token }) => ({
        url: `/alerts/type/${type}`,
        headers: {
          authorization: `Bearer ${token}`
        }
      }),
      providesTags: ["Alerts"],
    }),

    updateAlert: builder.mutation<Alert, { id: number; data: UpdateAlertRequest; token: string }>({
      query: ({ id, data, token }) => ({
        url: `/alerts/${id}/mark-read/`,
        method: "PATCH",
        body: data,
        headers: {
          authorization: `Bearer ${token}`
        }
      }),
      invalidatesTags: ["Alerts"],
    }),

    deleteAlert: builder.mutation<void, { id: number; token: string }>({
      query: ({ id, token }) => ({
        url: `/alerts/${id}/`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`
        }
      }),
      invalidatesTags: ["Alerts"],
    }),

    markAllAlertsAsRead: builder.mutation<void, { token: string }>({
      query: ({ token }) => ({
        url: "/alerts/mark-all-read/",
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`
        }
      }),
      invalidatesTags: ["Alerts"],
    }),

    getAlertSettings: builder.query<AlertSettings[], { token: string }>({
      query: ({ token }) => ({
        url: "/alert-settings",
        headers: {
          authorization: `Bearer ${token}`
        }
      }),
      providesTags: ["AlertSettings"],
    }),

    updateAlertSettings: builder.mutation<AlertSettings, { id: number; enabled: boolean; token: string }>({
      query: ({ id, enabled, token }) => ({
        url: `/alert-settings/${id}`,
        method: "PATCH",
        body: { enabled },
        headers: {
          authorization: `Bearer ${token}`
        }
      }),
      invalidatesTags: ["AlertSettings"],
    }),

    resetAlertSettings: builder.mutation<void, { token: string }>({
      query: ({ token }) => ({
        url: "/alert-settings/reset",
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`
        }
      }),
      invalidatesTags: ["AlertSettings"],
    }),
  }),
})

export const {
  useGetAlertsQuery,
  useGetUnreadAlertsQuery,
  useGetAlertsByTypeQuery,
  useUpdateAlertMutation,
  useDeleteAlertMutation,
  useMarkAllAlertsAsReadMutation,
  useGetAlertSettingsQuery,
  useUpdateAlertSettingsMutation,
  useResetAlertSettingsMutation,
} = alertApi 