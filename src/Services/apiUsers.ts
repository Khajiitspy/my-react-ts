import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../Utilities/createBaseQuery.ts';
import type {AdminUserViewModel, AdminUserListItem, PagedResult, AdminUserSearchParams, UserEditRequest } from './types.ts';
import {serialize} from "object-to-formdata";

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
        getUserById: builder.query<AdminUserViewModel, Number>({
          query: (id) => `${id}`,
        }),

        updateUser: builder.mutation<void, UserEditRequest>({
          query: (data) => {
            const formData = serialize(data, { indices: false });

            return {
              url: ``,
              method: "PUT",
              body: formData,
            }
          },
        }),

        getAllRoles: builder.query<string[], void>({
          query: () => `roles`,
        }),
    }),
});

export const { useSearchUsersQuery, useUpdateUserMutation, useGetUserByIdQuery, useGetAllRolesQuery } = apiUsers;
