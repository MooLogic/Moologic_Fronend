import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API_BASE_URL } from "@/lib/constants"
import { getSession } from "next-auth/react"

export interface User {
  id: string
  username: string
  email: string
  full_name: string
  phone_number: string
  profile_picture: string | null
  bio: string
  role: string
  worker_role: string | null
  language: string
  email_verified: boolean
  get_email_notifications: boolean
  get_push_notifications: boolean
  get_sms_notifications: boolean
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
  get_email_notifications: boolean
  get_push_notifications: boolean
  get_sms_notifications: boolean
  oversite_access: boolean
  language: string
}

export interface UpdateProfileRequest {
  name?: string
  username?: string
  email?: string
  phone_number?: string
  bio?: string
  language?: string
  worker_role?: string
  get_email_notifications?: boolean
  get_push_notifications?: boolean
  get_sms_notifications?: boolean
}

export interface ChangePasswordRequest {
  old_password: string
  new_password: string
}

export interface ResetPasswordRequest {
  email: string
}

export interface ConfirmResetPasswordRequest {
  user_id: string
  token: string
  new_password: string
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: async (headers) => {
      // Get session to access the token
      const session = await getSession()
      const token = session?.user?.accessToken

      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["Users", "Veterinarians", "Profile"],
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User, void>({
      query: () => ({
        url: "auth/current-user/",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    getFarmVeterinarians: builder.query<FarmVeterinarian[], void>({
      query: () => ({
        url: "core/farm-users/?role=veterinarian",
        method: "GET",
      }),
      providesTags: ["Veterinarians"],
      transformResponse: (response: any) => {
        return response.results.map((user: any) => ({
          id: user.id,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            full_name: user.full_name,
            phone_number: user.phone_number,
            profile_picture: user.profile_picture,
            role: user.role,
            worker_role: user.worker_role,
            language: user.language,
            email_verified: user.email_verified,
            get_email_notifications: user.get_email_notifications,
            get_push_notifications: user.get_push_notifications,
            get_sms_notifications: user.get_sms_notifications,
            bio: user.bio
          },
          specialization: user.specialization,
          license_number: user.license_number,
          is_active: user.is_active
        }))
      }
    }),

    getFarmUsers: builder.query<FarmUser[], void>({
      query: () => ({
        url: "auth/farm-users/",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),

    // Profile Management Endpoints
    checkEmailVerification: builder.query<{ is_verified: boolean }, void>({
      query: () => ({
        url: "auth/check-email-verification/",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    sendVerificationEmail: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "auth/send-verification-email/",
        method: "POST",
      }),
      invalidatesTags: ["Profile"],
    }),

    verifyEmail: builder.mutation<{ message: string }, { user_id: string; token: string }>({
      query: (body) => ({
        url: "auth/verify-email/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),

    updateProfile: builder.mutation<{ message: string; user: User }, UpdateProfileRequest>({
      query: (body) => ({
        url: "auth/update-profile/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Profile", "Users"],
    }),

    updateProfilePicture: builder.mutation<{ message: string; profile_picture_url: string }, FormData>({
      query: (body) => ({
        url: "auth/update-profile-picture/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile", "Users"],
    }),

    changePassword: builder.mutation<{ message: string }, ChangePasswordRequest>({
      query: (body) => ({
        url: "auth/change-password/",
        method: "POST",
        body,
      }),
    }),

    requestPasswordReset: builder.mutation<{ message: string }, ResetPasswordRequest>({
      query: (body) => ({
        url: "auth/password-reset/",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<{ message: string }, ConfirmResetPasswordRequest>({
      query: (body) => ({
        url: "auth/password-reset-confirm/",
        method: "POST",
        body,
      }),
    }),
  }),
})

export const {
  useGetCurrentUserQuery,
  useGetFarmVeterinariansQuery,
  useGetFarmUsersQuery,
  useCheckEmailVerificationQuery,
  useSendVerificationEmailMutation,
  useVerifyEmailMutation,
  useUpdateProfileMutation,
  useUpdateProfilePictureMutation,
  useChangePasswordMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
} = userApi 