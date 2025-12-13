import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API_BASE_URL } from "@/lib/constants"

export type LifeStage = "calf" | "heifer" | "cow" | "bull"
export type GestationStatus =
    | "not_pregnant"
    | "in_oestrus"
    | "missed_oestrus"
    | "pregnant"
    | "dry_off"
    | "calving"
export type GestationStage =
    | "not_pregnant"
    | "first_trimester"
    | "second_trimester"
    | "third_trimester"
    | "calving"
export type HealthStatus = "healthy" | "sick"
export type MilkingFrequency = "once" | "twice" | "thrice"

export interface Alert {
    id: number
    title?: string
    description?: string
    message?: string
    priority: "low" | "medium" | "high" | "Emergency" | "High" | string
    type?: string
    read?: boolean
    date?: string
    source_type?: string
    source_id?: string
    metadata?: Record<string, unknown>
}

export interface Cattle {
    id: number
    ear_tag_no: string
    breed?: string
    birth_date?: string | null
    birth_weight?: string | null
    current_weight?: string | null
    weaning_date?: string | null
    weaning_weight?: string | null
    gender: "male" | "female"
    life_stage: LifeStage
    life_stage_started_at?: string | null
    is_service_bull: boolean
    dam_id?: string
    sire_id?: string
    is_purchased: boolean
    purchase_date?: string | null
    purchase_source?: string | null
    last_insemination_date?: string | null
    last_calving_date?: string | null
    expected_calving_date?: string | null
    expected_insemination_date?: string | null
    gestation_status: GestationStatus
    gestation_stage: GestationStage
    health_status: HealthStatus
    milking_frequency?: MilkingFrequency
    custom_milking_times?: string[] | null
    avg_daily_milk?: number | null
    photo?: string | File | null
    created_at?: string
    updated_at?: string
    farm: number
}

export interface CattleResponse {
    count: number
    next: string | null
    previous: string | null
    results: Cattle[]
}

interface ApiError {
    status: number
    data: {
        error?: string
        message?: string
        detail?: string
    }
}

interface BirthRecord {
    id: number
    cattle: number
    mother_ear_tag: string
    calving_date: string
    calving_outcome: "successful" | "complications" | "stillborn" | "died_shortly_after"
    calf_count: number
    calf_gender: string
    calf_weight: string
    calf_ear_tag: string
    complications?: string
    veterinary_assistance: boolean
    notes?: string
    created_at: string
    updated_at: string
}

interface BirthRecordResponse {
    birth_record: BirthRecord
    alerts: Alert[]
}

interface BirthHistoryResponse {
    cattle_info: {
        ear_tag_no: string
        birth_date: string
        gender: string
    }
    as_mother: BirthRecord[]
    own_birth_record: BirthRecord | null
}

interface GestationMilestone {
    id: number
    milestone_type: string
    due_date: string
    completed_date?: string
    description: string
    is_completed: boolean
}

interface GestationCheck {
    id: number
    check_date: string
    gestation_week: number
    health_status: "normal" | "attention" | "critical"
    weight?: number
    body_condition_score?: number
    notes?: string
}

interface GestationData {
    cattle: Cattle & {
        gestation_progress: number
        trimester: number | null
        days_until_calving: number | null
        milestones: GestationMilestone[]
        gestation_checks: GestationCheck[]
    }
    treatment_records: any[]
    vaccination_records: any[]
    periodic_treatment_records: any[]
    periodic_vaccination_records: any[]
    alerts: Alert[]
    gantt_data: {
        tasks: any[]
        start_date: string
        end_date: string
    } | null
}

interface GestationDataResponse {
    count: number
    results: GestationData[]
}

interface TimelineEvent {
    date: string
    type: "milestone" | "health_check" | "treatment" | "vaccination"
    title: string
    description?: string
    status: string
}

interface GestationTimeline {
    cattle_id: number
    ear_tag_no: string
    gestation_progress: number
    trimester: number | null
    days_until_calving: number | null
    timeline_events: TimelineEvent[]
}

interface LactatingCattle {
    id: number
    ear_tag_no: string
    name: string
    milking_frequency: number
    last_milking: string | null
    can_milk_now: boolean
    days_in_milk: number
    lactation_number: number
}

interface LactatingCattleResponse {
    count: number
    results: LactatingCattle[]
}

type CattleBaseInput = {
    ear_tag_no: string
    breed?: string
    birth_date?: string | null
    birth_weight?: string | null
    current_weight?: string | null
    weaning_date?: string | null
    weaning_weight?: string | null
    gender: "male" | "female"
    life_stage: LifeStage
    is_service_bull?: boolean
    dam_id?: string
    sire_id?: string
    is_purchased: boolean
    purchase_date?: string | null
    purchase_source?: string | null
    last_insemination_date?: string | null
    last_calving_date?: string | null
    expected_calving_date?: string | null
    expected_insemination_date?: string | null
    gestation_status?: GestationStatus
    gestation_stage?: GestationStage
    health_status?: HealthStatus
    milking_frequency?: MilkingFrequency
    custom_milking_times?: string[]
    avg_daily_milk?: number | null
    photo?: File | null
}

export type CattleCreateRequest = CattleBaseInput & { accessToken: string }
export type CattleUpdateRequest = Partial<CattleBaseInput> & { accessToken: string; id: number | string }

const formatDateForApi = (date?: string | null): string | undefined => {
    if (!date) return undefined
    const parsed = new Date(date)
    if (Number.isNaN(parsed.getTime())) return undefined
    return parsed.toISOString().split("T")[0]
}

const appendFormValue = (formData: FormData, key: string, value: unknown) => {
    if (value === undefined || value === null || value === "") return

    if (value instanceof File) {
        formData.append(key, value)
        return
    }

    if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value))
        return
    }

    if (typeof value === "boolean") {
        formData.append(key, value ? "true" : "false")
        return
    }

    if (typeof value === "number") {
        formData.append(key, value.toString())
        return
    }

    formData.append(key, String(value))
}

const buildCattleFormData = (payload: Partial<CattleBaseInput>) => {
    const formData = new FormData()
    const { custom_milking_times, birth_date, weaning_date, purchase_date, last_insemination_date, last_calving_date, expected_calving_date, expected_insemination_date, ...rest } = payload

    appendFormValue(formData, "birth_date", formatDateForApi(birth_date || undefined))
    appendFormValue(formData, "weaning_date", formatDateForApi(weaning_date || undefined))
    appendFormValue(formData, "purchase_date", formatDateForApi(purchase_date || undefined))
    appendFormValue(formData, "last_insemination_date", formatDateForApi(last_insemination_date || undefined))
    appendFormValue(formData, "last_calving_date", formatDateForApi(last_calving_date || undefined))
    appendFormValue(formData, "expected_calving_date", formatDateForApi(expected_calving_date || undefined))
    appendFormValue(formData, "expected_insemination_date", formatDateForApi(expected_insemination_date || undefined))

    appendFormValue(formData, "custom_milking_times", custom_milking_times?.length ? custom_milking_times : undefined)

    Object.entries(rest).forEach(([key, value]) => appendFormValue(formData, key, value))

    return formData
}

const getErrorMessage = (response: any): string => {
    if (!response) return "An error occurred"
    if (typeof response === "string") return response

    const data = response.data || {}
    return data.error || data.message || data.detail || "An error occurred"
}

export const cattleApi = createApi({
    reducerPath: "cattleApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
    }),
    tagTypes: ["Cattle", "PregnantCattle", "GestationData", "BirthRecords", "LactatingCattle"],
    endpoints: (builder) => ({
        getCattleData: builder.query<CattleResponse, { accessToken: string }>({
            query: ({ accessToken }) => ({
                url: "core/cattle/",
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.results.map(({ id }) => ({ type: "Cattle" as const, id })),
                          "Cattle",
                      ]
                    : ["Cattle"],
            transformErrorResponse: (response: any) => ({
                status: response.status,
                message: getErrorMessage(response),
            }),
        }),

        getPregnantCattle: builder.query<CattleResponse, { accessToken: string }>({
            query: ({ accessToken }) => ({
                url: "core/cattle/pregnant/",
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.results.map(({ id }) => ({ type: "PregnantCattle" as const, id })),
                          "PregnantCattle",
                      ]
                    : ["PregnantCattle"],
        }),

        getGestationData: builder.query<GestationDataResponse, { accessToken: string }>({
            query: ({ accessToken }) => ({
                url: "core/cattle/gestation-data/",
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.results.map(({ cattle }) => ({ type: "GestationData" as const, id: cattle.id })),
                          "GestationData",
                      ]
                    : ["GestationData"],
        }),

        getCattleById: builder.query<Cattle, { accessToken: string; id: string | number }>({
            query: ({ accessToken, id }) => ({
                url: `core/cattle/${id}/`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
            providesTags: (result, error, { id }) => [{ type: "Cattle", id }],
            transformErrorResponse: (response: any) => ({
                status: response.status,
                message: getErrorMessage(response),
            }),
        }),

        postCattle: builder.mutation<Cattle, CattleCreateRequest>({
            query: ({ accessToken, ...payload }) => ({
                url: "core/cattle/create/",
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: buildCattleFormData(payload),
            }),
            invalidatesTags: ["Cattle", "PregnantCattle", "GestationData"],
        }),

        updateCattle: builder.mutation<Cattle, CattleUpdateRequest>({
            query: ({ accessToken, id, ...updates }) => ({
                url: `core/cattle/${id}/update/`,
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: buildCattleFormData(updates),
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Cattle", id },
                "Cattle",
                "PregnantCattle",
                "GestationData",
            ],
        }),

        deleteCattle: builder.mutation<void, { accessToken: string; id: string | number }>({
            query: ({ accessToken, id }) => ({
                url: `core/cattle/${id}/delete/`,
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Cattle", id },
                "Cattle",
                "PregnantCattle",
                "GestationData",
            ],
        }),

        generateCattleAlerts: builder.query<{ alerts: Alert[] }, { accessToken: string; id: string | number }>({
            query: ({ accessToken, id }) => ({
                url: `core/cattle/${id}/alerts/`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
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

        createBirthRecord: builder.mutation<BirthRecordResponse, {
            accessToken: string
            cattle: number
            calving_date: string
            calving_outcome: 'successful' | 'complications' | 'stillborn' | 'died_shortly_after'
            calf_count: number
            calf_gender: string
            calf_weight: string
            calf_ear_tag: string
            complications?: string
            veterinary_assistance: boolean
            notes?: string
        }>({
            query: ({ accessToken, calving_date, ...body }) => ({
                url: 'core/birth-records/create/',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: {
                    ...body,
                    calving_date: formatDateForApi(calving_date),
                },
            }),
            invalidatesTags: ['BirthRecords', 'Cattle', 'PregnantCattle'],
        }),

        // Update birth record
        updateBirthRecord: builder.mutation<BirthRecord, {
            accessToken: string
            id: number
            updates: Partial<BirthRecord>
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