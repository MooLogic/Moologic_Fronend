import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/lib/constants';
import process from 'process';

// Define interfaces for the API data types
interface Cattle {
  id: string;
  ear_tag_no: string;
  breed?: string;
  birth_date?: string;
  gender: "male" | "female";
  life_stage: "calf" | "heifer" | "cow" | "bull";
  dam_id?: string;
  sire_id?: string;
  is_purchased: boolean;
  purchase_date?: string;
  purchase_source?: string;
  gestation_status: "not_pregnant" | "pregnant" | "calving" | "in_oestrus" | "missed_oestrus" | "dry_off";
  gestation_stage: "not_pregnant" | "first_trimester" | "second_trimester" | "third_trimester" | "calving";
  health_status: "healthy" | "sick";
  last_insemination_date?: string;
  last_calving_date?: string;
  expected_calving_date?: string;
  expected_insemination_date?: string;
  photo?: string | File;
  created_at: string;
  updated_at: string;
  farm: number;
}

interface CattleResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Cattle[];
}

interface ApiError {
  status: number;
  data: {
    error?: string;
    message?: string;
    detail?: string;
  };
}

// Add these interfaces after the existing interfaces
interface BirthRecord {
    id: number;
    cattle: number;
    mother_ear_tag: string;
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
    birth_record: BirthRecord;
    alerts: Alert[];
}

interface BirthHistoryResponse {
    cattle_info: {
        ear_tag_no: string;
        birth_date: string;
        gender: string;
    };
    as_mother: BirthRecord[];
    own_birth_record: BirthRecord | null;
}

interface GestationMilestone {
    id: number;
    milestone_type: string;
    due_date: string;
    completed_date?: string;
    description: string;
    is_completed: boolean;
}

interface GestationCheck {
    id: number;
    check_date: string;
    gestation_week: number;
    health_status: 'normal' | 'attention' | 'critical';
    weight?: number;
    body_condition_score?: number;
    notes?: string;
}

interface GestationData {
    cattle: Cattle & {
        gestation_progress: number;
        trimester: number | null;
        days_until_calving: number | null;
        milestones: GestationMilestone[];
        gestation_checks: GestationCheck[];
    };
    treatment_records: any[];
    vaccination_records: any[];
    periodic_treatment_records: any[];
    periodic_vaccination_records: any[];
    alerts: Alert[];
    gantt_data: {
        tasks: any[];
        start_date: string;
        end_date: string;
    } | null;
}

interface GestationDataResponse {
    count: number;
    results: GestationData[];
}

interface TimelineEvent {
    date: string;
    type: 'milestone' | 'health_check' | 'treatment' | 'vaccination';
    title: string;
    description?: string;
    status: string;
}

interface GestationTimeline {
    cattle_id: number;
    ear_tag_no: string;
    gestation_progress: number;
    trimester: number | null;
    days_until_calving: number | null;
    timeline_events: TimelineEvent[];
}

// Add this interface after the existing interfaces
interface LactatingCattle {
  id: number;
  ear_tag_no: string;
  name: string;
  milking_frequency: number;
  last_milking: string | null;
  can_milk_now: boolean;
  days_in_milk: number;
  lactation_number: number;
}

interface LactatingCattleResponse {
  count: number;
  results: LactatingCattle[];
}

// Helper function to format dates for API
const formatDateForApi = (date: string | undefined): string | undefined => {
  if (!date) return undefined;
  return new Date(date).toISOString().split('T')[0];
};

// Helper function to get error message from response
const getErrorMessage = (response: any): string => {
    if (!response) return 'An error occurred';
    if (typeof response === 'string') return response;
    
    const data = response.data || {};
    return data.error || data.message || data.detail || 'An error occurred';
};

export const cattleApi = createApi({
    reducerPath: 'cattleApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            // Don't set Content-Type for FormData, let the browser set it with the boundary
            return headers;
        },
    }),
    tagTypes: ['Cattle', 'PregnantCattle', 'GestationData', 'BirthRecords', 'LactatingCattle'],
    endpoints: (builder) => ({
        // Get all cattle
        getCattleData: builder.query<CattleResponse, { accessToken: string }>({
            query: (data) => ({
                url: 'core/cattle/',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${data.accessToken}`,
                },
            }),
            providesTags: ['Cattle'],
            transformErrorResponse: (response: any) => ({
                status: response.status,
                message: getErrorMessage(response),
            }),
        }),

        // Get pregnant cattle
        getPregnantCattle: builder.query<CattleResponse, { accessToken: string }>({
            query: (data) => ({
                url: 'core/cattle/pregnant/',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${data.accessToken}`,
                },
            }),
            providesTags: ['PregnantCattle'],
        }),

        // Get gestation data
        getGestationData: builder.query<GestationDataResponse, { accessToken: string }>({
            query: (data) => ({
                url: 'core/cattle/gestation-data/',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${data.accessToken}`,
                },
            }),
            providesTags: ['GestationData'],
        }),

        // Get single cattle by ID
        getCattleById: builder.query<Cattle, { accessToken: string; id: string }>({
            query: ({ accessToken, id }) => ({
                url: `core/cattle/${id}/`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
            providesTags: (result, error, { id }) => [{ type: 'Cattle', id }],
            transformErrorResponse: (response: any) => ({
                status: response.status,
                message: getErrorMessage(response),
            }),
        }),

        // Create new cattle
        postCattle: builder.mutation<Cattle, {
                accessToken: string;
                breed?: string;
                birth_date?: string;
            gender: "male" | "female";
            life_stage: "calf" | "heifer" | "cow" | "bull";
                ear_tag_no: string;
                dam_id?: string;
                sire_id?: string;
                is_purchased: boolean;
            purchase_date?: string;
            purchase_source?: string;
            gestation_status: "not_pregnant" | "pregnant" | "calving";
            health_status: "healthy" | "sick";
            last_insemination_date?: string;
            photo?: File;
        }>({
            query: (data) => {
                const formData = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                    if (key !== 'accessToken' && value !== undefined) {
                        if (key.includes('date') && typeof value === 'string') {
                            formData.append(key, formatDateForApi(value) || '');
                        } else if (typeof value === 'boolean') {
                            formData.append(key, value ? '1' : '0');
                        } else if (value instanceof File) {
                            formData.append(key, value);
                        } else if (typeof value === 'string') {
                            formData.append(key, value);
                        }
                    }
                });

                return {
                    url: 'core/cattle/create/',
                method: 'POST',
                    headers: {
                        Authorization: `Bearer ${data.accessToken}`,
                    },
                    body: formData,
                };
            },
            invalidatesTags: ['Cattle', 'PregnantCattle', 'GestationData'],
        }),

        // Update cattle
        updateCattle: builder.mutation<Cattle, {
            accessToken: string;
            id: string;
            updates: Partial<Cattle>;
        }>({
            query: ({ accessToken, id, updates }) => ({
                url: `core/cattle/${id}/update/`,
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: updates,
            }),
            invalidatesTags: ['Cattle', 'PregnantCattle', 'GestationData'],
        }),

        // Delete cattle
        deleteCattle: builder.mutation<void, { accessToken: string; id: string }>({
            query: (data) => ({
                url: `core/cattle/${data.id}/delete/`,
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${data.accessToken}`,
                },
            }),
            invalidatesTags: ['Cattle', 'PregnantCattle', 'GestationData'],
        }),

        // Generate alerts for a specific cattle
        generateCattleAlerts: builder.query<any, { accessToken: string; id: string }>({
            query: (data) => ({
                url: `core/cattle/${data.id}/alerts/`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${data.accessToken}`,
                },
            }),
        }),

        // Get all birth records
        getBirthRecords: builder.query<{ count: number; results: BirthRecord[] }, { accessToken: string }>({
            query: (data) => ({
                url: 'core/birth-records/',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${data.accessToken}`,
                },
            }),
            providesTags: ['BirthRecords'],
        }),

        // Get single birth record
        getBirthRecord: builder.query<BirthRecord, { accessToken: string; id: number }>({
            query: ({ accessToken, id }) => ({
                url: `core/birth-records/${id}/`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
            providesTags: (result, error, { id }) => [{ type: 'BirthRecords', id }],
        }),

        // Create birth record
        createBirthRecord: builder.mutation<BirthRecordResponse, {
            accessToken: string;
            cattle: number;
            calving_date: string;
            calving_outcome: 'successful' | 'complications' | 'stillborn' | 'died_shortly_after';
            calf_count: number;
            calf_gender: string;
            calf_weight: string;
            calf_ear_tag: string;
            complications?: string;
            veterinary_assistance: boolean;
            notes?: string;
        }>({
            query: (data) => ({
                url: 'core/birth-records/create/',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${data.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: {
                    cattle: data.cattle,
                    calving_date: formatDateForApi(data.calving_date),
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
            invalidatesTags: ['BirthRecords', 'Cattle', 'PregnantCattle'],
        }),

        // Update birth record
        updateBirthRecord: builder.mutation<BirthRecord, {
            accessToken: string;
            id: number;
            updates: Partial<BirthRecord>;
        }>({
            query: ({ accessToken, id, updates }) => ({
                url: `core/birth-records/${id}/update/`,
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: {
                    ...updates,
                    calving_date: updates.calving_date ? formatDateForApi(updates.calving_date) : undefined,
                },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'BirthRecords', id },
                'BirthRecords',
                'Cattle',
                'PregnantCattle',
            ],
        }),

        // Delete birth record
        deleteBirthRecord: builder.mutation<void, { accessToken: string; id: number }>({
            query: ({ accessToken, id }) => ({
                url: `core/birth-records/${id}/delete/`,
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
            invalidatesTags: ['BirthRecords', 'Cattle', 'PregnantCattle'],
        }),

        // Get cattle birth history
        getCattleBirthHistory: builder.query<BirthHistoryResponse, { accessToken: string; cattleId: number }>({
            query: ({ accessToken, cattleId }) => ({
                url: `core/cattle/${cattleId}/birth-history/`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
            providesTags: (result, error, { cattleId }) => [{ type: 'BirthRecords', id: cattleId }],
        }),

        // Get detailed gestation timeline for a specific cattle
        getCattleGestationTimeline: builder.query<GestationTimeline, { accessToken: string; cattleId: number }>({
            query: ({ accessToken, cattleId }) => ({
                url: `core/cattle/${cattleId}/gestation-timeline/`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
            providesTags: (result, error, { cattleId }) => [{ type: 'GestationData', id: cattleId }],
        }),

        // Create a gestation check
        createGestationCheck: builder.mutation<GestationCheck, {
            accessToken: string;
            cattle: number;
            check_date: string;
            gestation_week: number;
            health_status: 'normal' | 'attention' | 'critical';
            weight?: number;
            body_condition_score?: number;
            notes?: string;
        }>({
            query: (data) => ({
                url: 'core/gestation-checks/create/',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${data.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: {
                    cattle: data.cattle,
                    check_date: data.check_date,
                    gestation_week: data.gestation_week,
                    health_status: data.health_status,
                    weight: data.weight,
                    body_condition_score: data.body_condition_score,
                    notes: data.notes,
                },
            }),
            invalidatesTags: ['GestationData'],
        }),

        // Update a gestation milestone
        updateMilestone: builder.mutation<GestationMilestone, {
            accessToken: string;
            milestoneId: number;
            is_completed: boolean;
            completed_date?: string;
        }>({
            query: ({ accessToken, milestoneId, ...updates }) => ({
                url: `core/gestation-milestones/${milestoneId}/update/`,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: updates,
            }),
            invalidatesTags: ['GestationData'],
        }),

        // Get lactating cattle
        getLactatingCattle: builder.query<LactatingCattleResponse, { accessToken: string }>({
            query: (data) => ({
                url: 'milk/lactating-cattle/',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${data.accessToken}`,
                },
            }),
            providesTags: ['LactatingCattle'],
        }),
    }),
});

export const {
    useGetCattleDataQuery,
    useGetPregnantCattleQuery,
    useGetGestationDataQuery,
    useGetCattleByIdQuery,
    usePostCattleMutation,
    useUpdateCattleMutation,
    useDeleteCattleMutation,
    useGenerateCattleAlertsQuery,
    useGetBirthRecordsQuery,
    useGetBirthRecordQuery,
    useCreateBirthRecordMutation,
    useUpdateBirthRecordMutation,
    useDeleteBirthRecordMutation,
    useGetCattleBirthHistoryQuery,
    useGetCattleGestationTimelineQuery,
    useCreateGestationCheckMutation,
    useUpdateMilestoneMutation,
    useGetLactatingCattleQuery,
} = cattleApi;