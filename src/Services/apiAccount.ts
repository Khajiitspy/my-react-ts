import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../Utilities/createBaseQuery.ts';

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
}

export const apiAccount = createApi({
    reducerPath: 'api/account',
    baseQuery: createBaseQuery('account'),
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: 'login',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
});

export const { useLoginMutation } = apiAccount;