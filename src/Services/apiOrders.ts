import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../Utilities/createBaseQuery.ts';
import type {OrderOptions, OrderModel} from "./types.ts";

export const apiOrders = createApi({
    reducerPath: 'api/orders',
    baseQuery: createBaseQuery('orders'),
    endpoints: (builder) => ({
        getOrders: builder.query<OrderModel[], void>({
            query: () => ({
                url: '',
            }),
        }),
        getOrderOptions: builder.query<OrderOptions, void>({
            query: () => ({
                url: 'options',
            }),
        }),
    }),
});

export const {
    useGetOrdersQuery,
    useGetOrderOptionsQuery
} = apiOrders;
