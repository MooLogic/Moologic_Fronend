import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API_BASE_URL } from "@/lib/constants"

export interface TreatmentRecord {
  id: string
  cattle: {
    id: string
    ear_tag_no: string
  }
  veterinarian?: {
    id: string
    name: string
  }
  treatment_name: string
  treatment_description?: string
  treatment_date: string
  treatment_cost?: number
  gestation_stage_target?: string
  notes?: string
}

export interface VaccinationRecord {
  id: string
  cattle: {
    id: string
    ear_tag_no: string
  }
  veterinarian?: {
    id: string
    name: string
  }
  vaccination_name: string
  vaccination_date: string
  vaccination_cost?: number
  gestation_stage_target?: string
  notes?: string
}

export interface PeriodicTreatmentRecord {
  id: string
  cattle: {
    id: string
    ear_tag_no: string
  } | null
  veterinarian: {
    id: string
    name: string
  }
  treatment_name: string
  treatment_description?: string
  last_treatment_date: string
  next_treatment_date: string
  interval_days: number
  notification_sent: boolean
  gestation_stage_target?: string
  treatment_cost?: number
  is_farm_wide: boolean
}

export interface PeriodicVaccinationRecord {
  id: string
  cattle: {
    id: string
    ear_tag_no: string
  } | null
  veterinarian: {
    id: string
    name: string
  }
  vaccination_name: string
  last_vaccination_date: string
  next_vaccination_date: string
  interval_days: number
  notification_sent: boolean
  gestation_stage_target?: string
  vaccination_cost?: number
  is_farm_wide: boolean
}

export interface CattleHealthRecords {
  treatments: TreatmentRecord[]
  vaccinations: VaccinationRecord[]
  periodic_treatments: PeriodicTreatmentRecord[]
  periodic_vaccinations: PeriodicVaccinationRecord[]
}

export const healthApi = createApi({
  reducerPath: "healthApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState, endpoint, extra, type, ...rest }) => {
      const token = rest?.queryArgs?.accessToken
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: [
    "Health",
    "Treatment",
    "Vaccination",
    "PeriodicTreatment",
    "PeriodicVaccination",
    "CattleHealth"
  ],
  endpoints: (builder) => ({
    getCattleHealthRecords: builder.query<CattleHealthRecords, { accessToken: string; cattleId?: string }>({
      query: ({ accessToken, cattleId }) => ({
        url: cattleId ? `core/cattle/${cattleId}/health-records/` : 'core/health-records/',
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      providesTags: (result, error, { cattleId }) => [
        cattleId ? { type: "CattleHealth", id: cattleId } : "CattleHealth",
        "Treatment",
        "Vaccination",
        "PeriodicTreatment",
        "PeriodicVaccination"
      ],
      transformResponse: (response: any): CattleHealthRecords => {
        console.log('Health records response:', response);
        return {
          treatments: response.treatments || [],
          vaccinations: response.vaccinations || [],
          periodic_treatments: response.periodic_treatments || [],
          periodic_vaccinations: response.periodic_vaccinations || [],
        };
      },
    }),

    getAllTreatmentRecords: builder.query<{ results: TreatmentRecord[] }, { accessToken: string }>({
      query: ({ accessToken }) => ({
        url: "core/treatments/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      providesTags: ["Treatment"],
      transformResponse: (response: any) => {
        console.log('Treatment records response:', response);
        return {
          results: Array.isArray(response) ? response : (response?.results || [])
        };
      },
    }),

    getAllVaccinationRecords: builder.query<{ results: VaccinationRecord[] }, { accessToken: string }>({
      query: ({ accessToken }) => ({
        url: "core/vaccinations/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      providesTags: ["Vaccination"],
      transformResponse: (response: any) => {
        console.log('Vaccination records response:', response);
        return {
          results: Array.isArray(response) ? response : (response?.results || [])
        };
      },
    }),

    // Treatment Records
    createTreatmentRecord: builder.mutation<TreatmentRecord, { accessToken: string; data: Partial<TreatmentRecord> }>({
      query: ({ accessToken, data }) => ({
        url: "core/treatments/create/",
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
      }),
      invalidatesTags: ["Treatment", "CattleHealth"],
    }),

    updateTreatmentRecord: builder.mutation<TreatmentRecord, { accessToken: string; id: string; data: Partial<TreatmentRecord> }>({
      query: ({ accessToken, id, data }) => ({
        url: `core/treatments/${id}/update/`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
      }),
      invalidatesTags: ["Treatment", "CattleHealth"],
    }),

    deleteTreatmentRecord: builder.mutation<void, { accessToken: string; id: string }>({
      query: ({ accessToken, id }) => ({
        url: `core/treatments/${id}/delete/`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      invalidatesTags: ["Treatment", "CattleHealth"],
    }),

    // Vaccination Records
    createVaccinationRecord: builder.mutation<VaccinationRecord, { accessToken: string; data: Partial<VaccinationRecord> }>({
      query: ({ accessToken, data }) => ({
        url: "core/vaccinations/create/",
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
      }),
      invalidatesTags: (result, error, { data }) => [
        { type: "Vaccination", id: data.cattle?.id },
        { type: "CattleHealth", id: data.cattle?.id }
      ],
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        message: response.data?.error || response.data?.message || response.data?.detail || "Failed to create vaccination record"
      }),
    }),

    updateVaccinationRecord: builder.mutation<VaccinationRecord, { accessToken: string; id: string; data: Partial<VaccinationRecord> }>({
      query: ({ accessToken, id, data }) => ({
        url: `core/vaccinations/${id}/update/`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
      }),
      invalidatesTags: (result, error, { data }) => [
        { type: "Vaccination", id: data.cattle?.id },
        { type: "CattleHealth", id: data.cattle?.id }
      ],
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        message: response.data?.error || response.data?.message || response.data?.detail || "Failed to update vaccination record"
      }),
    }),

    deleteVaccinationRecord: builder.mutation<void, { accessToken: string; id: string }>({
      query: ({ accessToken, id }) => ({
        url: `core/vaccinations/${id}/delete/`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      invalidatesTags: ["Vaccination", "CattleHealth"],
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        message: response.data?.error || response.data?.message || response.data?.detail || "Failed to delete vaccination record"
      }),
    }),

    // Periodic Treatment Records
    getPeriodicTreatments: builder.query<{ results: PeriodicTreatmentRecord[] }, { accessToken: string; cattleId?: string }>({
      query: ({ accessToken, cattleId }) => ({
        url: cattleId ? `core/periodic-treatments/?cattle=${cattleId}` : "core/periodic-treatments/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      providesTags: ["PeriodicTreatment"],
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        message: response.data?.error || response.data?.message || response.data?.detail || "Failed to fetch periodic treatments"
      }),
    }),

    addPeriodicTreatment: builder.mutation<PeriodicTreatmentRecord, { 
      accessToken: string; 
      data: Partial<PeriodicTreatmentRecord> & { is_farm_wide: boolean } 
    }>({
      query: ({ accessToken, data }) => ({
        url: "core/periodic-treatments/create/",
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
      }),
      invalidatesTags: ["PeriodicTreatment", "CattleHealth"],
    }),

    updatePeriodicTreatment: builder.mutation<PeriodicTreatmentRecord, { accessToken: string; id: string; data: Partial<PeriodicTreatmentRecord> }>({
      query: ({ accessToken, id, data }) => ({
        url: `core/periodic-treatments/${id}/update/`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
      }),
      invalidatesTags: (result, error, { data }) => [
        { type: "PeriodicTreatment", id: data.cattle?.id },
        { type: "CattleHealth", id: data.cattle?.id }
      ],
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        message: response.data?.error || response.data?.message || response.data?.detail || "Failed to update periodic treatment"
      }),
    }),

    deletePeriodicTreatment: builder.mutation<void, { accessToken: string; id: string }>({
      query: ({ accessToken, id }) => ({
        url: `core/periodic-treatments/${id}/delete/`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      invalidatesTags: ["PeriodicTreatment", "CattleHealth"],
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        message: response.data?.error || response.data?.message || response.data?.detail || "Failed to delete periodic treatment"
      }),
    }),

    // Periodic Vaccination Records
    getPeriodicVaccinations: builder.query<{ results: PeriodicVaccinationRecord[] }, { accessToken: string; cattleId?: string }>({
      query: ({ accessToken, cattleId }) => ({
        url: cattleId ? `core/periodic-vaccinations/?cattle=${cattleId}` : "core/periodic-vaccinations/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      providesTags: ["PeriodicVaccination"],
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        message: response.data?.error || response.data?.message || response.data?.detail || "Failed to fetch periodic vaccinations"
      }),
    }),

    addPeriodicVaccination: builder.mutation<PeriodicVaccinationRecord, { 
      accessToken: string; 
      data: Partial<PeriodicVaccinationRecord> & { is_farm_wide: boolean } 
    }>({
      query: ({ accessToken, data }) => ({
        url: "core/periodic-vaccinations/create/",
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
      }),
      invalidatesTags: ["PeriodicVaccination", "CattleHealth"],
    }),

    updatePeriodicVaccination: builder.mutation<PeriodicVaccinationRecord, { accessToken: string; id: string; data: Partial<PeriodicVaccinationRecord> }>({
      query: ({ accessToken, id, data }) => ({
        url: `core/periodic-vaccinations/${id}/update/`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
      }),
      invalidatesTags: (result, error, { data }) => [
        { type: "PeriodicVaccination", id: data.cattle?.id },
        { type: "CattleHealth", id: data.cattle?.id }
      ],
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        message: response.data?.error || response.data?.message || response.data?.detail || "Failed to update periodic vaccination"
      }),
    }),

    deletePeriodicVaccination: builder.mutation<void, { accessToken: string; id: string }>({
      query: ({ accessToken, id }) => ({
        url: `core/periodic-vaccinations/${id}/delete/`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      invalidatesTags: ["PeriodicVaccination", "CattleHealth"],
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        message: response.data?.error || response.data?.message || response.data?.detail || "Failed to delete periodic vaccination"
      }),
    }),
  }),
})

export const {
  useGetCattleHealthRecordsQuery,
  useCreateTreatmentRecordMutation,
  useUpdateTreatmentRecordMutation,
  useDeleteTreatmentRecordMutation,
  useCreateVaccinationRecordMutation,
  useUpdateVaccinationRecordMutation,
  useDeleteVaccinationRecordMutation,
  useGetPeriodicTreatmentsQuery,
  useAddPeriodicTreatmentMutation,
  useUpdatePeriodicTreatmentMutation,
  useDeletePeriodicTreatmentMutation,
  useGetPeriodicVaccinationsQuery,
  useAddPeriodicVaccinationMutation,
  useUpdatePeriodicVaccinationMutation,
  useDeletePeriodicVaccinationMutation,
  useGetAllTreatmentRecordsQuery,
  useGetAllVaccinationRecordsQuery,
} = healthApi 