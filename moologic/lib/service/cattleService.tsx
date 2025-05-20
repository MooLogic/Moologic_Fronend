import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import process from 'process';

export const cattleApi = createApi({
    reducerPath: 'cattleApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.base_url || 'http://127.0.0.1:8000/',
    }),
    tagTypes: ['Cattle'],
    endpoints: (builder) => ({
        getCattleData: builder.query({
            query: (data: { accessToken: string }) => ({
                url: '/core/cattle/',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${data.accessToken}`,
                },
            }),
            providesTags: [{ type: 'Cattle', id: 'LIST' }],
            onQueryStarted: async (arg, { queryFulfilled }) => {
                console.log("getCattleData query started with accessToken:", arg.accessToken);
                try {
                    const { data } = await queryFulfilled;
                    console.log("getCattleData query fulfilled with data:", data);
                } catch (err) {
                    console.error("getCattleData query failed:", err);
                }
            },
        }),

        getCattleById: builder.query({
            query: (data: { accessToken: string; id: string }) => ({
                url: `/core/cattle/${data.id}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${data.accessToken}`,
                },
            }),
            providesTags: (result, error, { id }) => [{ type: 'Cattle', id }],
        }),

        postCattle: builder.mutation({
            query: (data: {
                accessToken: string;
                breed?: string;
                birth_date?: string;
                gender: string;
                life_stage: string;
                ear_tag_no: string;
                dam_id?: string;
                sire_id?: string;
                is_purchased: boolean;
                gestation_status: string;
                health_status: string;
            }) => ({
                url: '/core/cattle/create/',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${data.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: {
                    breed: data.breed || undefined,
                    birth_date: data.birth_date || undefined,
                    gender: data.gender,
                    life_stage: data.life_stage,
                    ear_tag_no: data.ear_tag_no,
                    dam_id: data.dam_id || undefined,
                    sire_id: data.sire_id || undefined,
                    is_purchased: data.is_purchased,
                    gestation_status: data.gestation_status,
                    health_status: data.health_status,
                },
            }),
            invalidatesTags: [{ type: 'Cattle', id: 'LIST' }],
            async onQueryStarted({ accessToken, ...payload }, { dispatch, queryFulfilled }) {
                console.log("postCattle mutation started with payload:", payload);
                const tempId = `temp-${Date.now()}`;
                // Optimistically update the cattle list
                const patchResult = dispatch(
                    cattleApi.util.updateQueryData('getCattleData', { accessToken }, (draft) => {
                        console.log("Optimistically updating cache with payload:", payload);
                        if (!draft.results) {
                            draft.results = [];
                        }
                        const newCattle = {
                            ...payload,
                            id: tempId,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                            last_insemination_date: null,
                            last_calving_date: null,
                            expected_calving_date: null,
                            expected_insemination_date: null,
                        };
                        draft.results.unshift(newCattle);
                        console.log("Cache after optimistic update:", draft.results);
                    })
                );
                try {
                    const { data } = await queryFulfilled;
                    console.log("postCattle mutation fulfilled with data:", data);
                    // Update cache with server response
                    dispatch(
                        cattleApi.util.updateQueryData('getCattleData', { accessToken }, (draft) => {
                            console.log("Updating cache with server response:", data);
                            const tempIndex = draft.results.findIndex((c) => c.id === tempId);
                            if (tempIndex !== -1) {
                                draft.results[tempIndex] = { ...data, id: data.id || tempId };
                            } else {
                                draft.results.unshift({ ...data, id: data.id || tempId });
                            }
                            console.log("Cache after server update:", draft.results);
                        })
                    );
                } catch (err) {
                    console.error("postCattle mutation failed, reverting optimistic update:", err);
                    patchResult.undo();
                    console.log("Cache after reversion:", cattleApi.util.getCachedQueryData('getCattleData', { accessToken }));
                }
            },
        }),
    }),
});

export const { useGetCattleDataQuery, useGetCattleByIdQuery, usePostCattleMutation } = cattleApi;