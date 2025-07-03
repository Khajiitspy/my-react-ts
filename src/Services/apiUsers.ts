// Services/apiUsers.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../Utilities/createBaseQuery.ts';
import type { AdminUserListItem, PagedResult } from './types.ts';

export interface AdminUserSearchParams {
    role?: string;
    fullName?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
}

export const apiUsers = createApi({
    reducerPath: 'api/users',
    baseQuery: createBaseQuery('users'),
    endpoints: (builder) => ({
        searchUsers: builder.query<PagedResult<AdminUserListItem>, AdminUserSearchParams>({
            query: (params) => ({
                url: 'search',
                method: 'GET',
                params,
            }),
        }),
    }),
});

export const { useSearchUsersQuery } = apiUsers;
