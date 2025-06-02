import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API_BASE_URL } from "@/lib/constants"

export interface User {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  role: string
  is_active: boolean
}

export interface FarmVeterinarian {
  id: string
  user: User
  specialization?: string
  license_number?: string
  is_active: boolean
}

export interface FarmUser {
  id: number
  email: string
  username: string
  full_name: string
  phone_number: string
  profile_picture: string | null
  role: string
  worker_role: string
  farm: number
  get_email_notification: boolean
  get_push_notification: boolean
  get_sms_notification: boolean
  oversite_access: boolean
  language: string
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState, endpoint, extra, type, ...rest }) => {
      const token = rest?.queryArgs?.accessToken
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["Users", "Veterinarians"],
  endpoints: (builder) => ({
    getFarmVeterinarians: builder.query<FarmVeterinarian[], { accessToken: string }>({
      query: () => ({
        url: "core/farm-users/?role=veterinarian",
        method: "GET",
      }),
      providesTags: ["Veterinarians"],
      transformResponse: (response: any) => {
        // Transform the response to match our FarmVeterinarian interface
        return response.results.map((user: any) => ({
          id: user.id,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            is_active: user.is_active
          },
          specialization: user.specialization,
          license_number: user.license_number,
          is_active: user.is_active
        }))
      },
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        message: response.data?.error || response.data?.message || response.data?.detail || "Failed to fetch veterinarians"
      }),
    }),
    getFarmUsers: builder.query<FarmUser[], { accessToken: string }>({
      query: ({ accessToken }) => ({
        url: "auth/farm-users/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      providesTags: ["Users"],
      transformResponse: (response: any) => {
        // The response is already in the correct format
        return response
      },
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        message: response.data?.error || response.data?.message || response.data?.detail || "Failed to fetch farm users"
      }),
    }),
  }),
})

export const {
  useGetFarmVeterinariansQuery,
  useGetFarmUsersQuery,
} = userApi 