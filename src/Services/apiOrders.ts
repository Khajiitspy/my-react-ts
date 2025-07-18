import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../Utilities/createBaseQuery.ts';
import type {SimpleValue, OrderModel} from "./types.ts";

export const apiOrders = createApi({
    reducerPath: 'api/orders',
    baseQuery: createBaseQuery('orders'),
    endpoints: (builder) => ({
        getOrders: builder.query<OrderModel[], void>({
            query: () => ({
                url: '',
            }),
        }),
        getCities: builder.query<SimpleValue[], string>({
            query: (search) => ({
                url: `cities?search=${search}`,
            }),
        }),
        getPostDepartments: builder.query<SimpleValue[], number>({
            query: (cityId) => ({
                url: `postDepartments?cityId=${cityId}`,
            }),
        }),
        getPaymentTypes: builder.query<SimpleValue[], void>({
            query: () => ({
                url: 'paymentTypes',
            }),
        }),
    }),
});

export const {
    useGetOrdersQuery,
    useGetCitiesQuery,
    useGetPostDepartmentsQuery,
    useGetPaymentTypesQuery,
} = apiOrders;
