import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import process from 'process';

export const cattleApi = createApi({
    reducerPath: 'cattleApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.base_url || 'http://127.0.0.1:8000/',
        
    }),
    endpoints: (builder) => ({
        getCattleData: builder.query({
        query: (data : {accessToken: string, }) => ({
            url: '/core/cattle/',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${data.accessToken}`,
            },
        })
    }),

        getCattleById: builder.query({
            query: (data : {accessToken: string, id: string}) => ({
                url: `/core/cattle/${data.id}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${data.accessToken}`,
                },
            })
        }),

        postCattle: builder.mutation({
            query: (data : {
                accessToken: string;
                breed: string;
                birth_date: string;
                gender: string;
                life_stage: string;
                ear_tag_no : string;
                dam_id: string;
                sire_id: string;
                is_purchased: boolean;
                is_pregnant: boolean;
                last_insemination_date: string;
                last_calving_date: string;
                expected_calving_date: string;
                expected_insemination_date: string;
                gestation_status: string;
                health_status: string;
            }) => ({
                url: '/core/cattle',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${data.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: {
                    breed: data.breed,
                    birth_date: data.birth_date,
                    gender : data.gender,
                    life_stage: data.life_stage,
                    ear_tag_no : data.ear_tag_no,  
                    dam_id: data.dam_id,
                    sire_id: data.sire_id,
                    is_purchased: data.is_purchased,
                    is_pregnant: data.is_pregnant,
                    last_insemination_date: data.last_insemination_date,
                    last_calving_date: data.last_calving_date,
                    expected_calving_date: data.expected_calving_date,
                    expected_insemination_date: data.expected_insemination_date,
                    gestation_status: data.gestation_status,
                    health_status: data.health_status,
                },
            })
        })
    }),
})

export const { useGetCattleDataQuery, useGetCattleByIdQuery, usePostCattleMutation } = cattleApi;