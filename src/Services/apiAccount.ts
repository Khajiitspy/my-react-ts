import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../Utilities/createBaseQuery.ts';
import {serialize} from "object-to-formdata";
import type {IRegister} from "./types.ts";

export interface ILoginRequest {
    email: string;
    password: string;
}

interface ILoginResponse {
    token: string;
}

export const apiAccount = createApi({
    reducerPath: 'api/account',
    baseQuery: createBaseQuery('account'),
    endpoints: (builder) => ({
        login: builder.mutation<ILoginResponse, ILoginRequest>({
            query: (credentials) => ({
                url: 'login',
                method: 'POST',
                body: credentials,
            }), 
        }),
        register: builder.mutation<ILoginResponse, IRegister>({
            query: (credentials) => {
                const formData = serialize(credentials);
                return{
                    url: 'register',
                    method: 'POST',
                    body: formData};
            },
        }),
        googleLogin: builder.mutation<ILoginResponse, { token: string }>({
            query: (body) => ({
                url: 'googlelogin',
                method: 'POST',
                body,
            }),
        }),
        googleRegister: builder.mutation<ILoginResponse, { token: string }>({
            query: (body) => ({
                url: 'googleregister',
                method: 'POST',
                body,
            }),
        }),

    }),
});

export const { useLoginMutation, useRegisterMutation, useGoogleLoginMutation, useGoogleRegisterMutation } = apiAccount;