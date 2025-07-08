import { createApi} from '@reduxjs/toolkit/query/react';
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

export interface IForgotPasswordRequest {
    email: string; 
}

export  interface IValidateTokenRequest {
    token: string;
    email: string;
}

export  interface IResetPasswordRequest {
    Password: string;
    token: string;
    email: string;
}

export const apiAccount = createApi({
    reducerPath: 'api/account',
    baseQuery: createBaseQuery('account'),
    tagTypes: ['Account'],
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
        // googleLogin: builder.mutation<ILoginResponse, { token: string }>({
        //     query: (body) => ({
        //         url: 'googlelogin',
        //         method: 'POST',
        //         body,
        //     }),
        // }),
        googleRegister: builder.mutation<ILoginResponse, { token: string }>({
            query: (body) => ({
                url: 'googleregister',
                method: 'POST',
                body,
            }),
        }),
        loginByGoogle:builder.mutation<{token: string}, string>({
            query: (token) => ({
                url: 'googleLogin2',
                method: 'POST',
                body: {token}
            })
        }),

        //запускаємо процедуру відновлення паролю по пошті
        forgotPassword: builder.mutation<void, IForgotPasswordRequest>({
            query: (data) => ({
                url: 'forgotPassword',
                method: 'POST',
                body: data
            })
        }),

        //перевіряємо чи токен дійсний
        validateResetToken: builder.query<{ isValid: boolean }, IValidateTokenRequest>({
            query: (params) => ({
                url: 'validateResetToken',
                params, // це додасть параметри як query string: ?token=abc&email=...
            }),
            providesTags: ['Account'],
        }),
        
        // validateResetToken: builder.query<{isValid: boolean}, IValidateTokenRequest>({
        //     query: (data) => ({
        //         url: 'validateResetToken',
        //         method: 'GET',
        //         body: {data}
        //     })
        // }),

        //встановлюємо новий пароль
        resetPassword: builder.mutation<void, IResetPasswordRequest>({
            query: (data) => ({
                url: 'resetPassword',
                method: 'POST',
                body: data
            })
        }),
    }),
});

export const { useLoginMutation,
     useRegisterMutation,
     useGoogleRegisterMutation,
     useLoginByGoogleMutation,
     useForgotPasswordMutation,
     useResetPasswordMutation,
     useValidateResetTokenQuery,
     } = apiAccount;
