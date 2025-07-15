import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../Utilities/createBaseQuery.ts';
import type {OrderModel} from "./types.ts";

export const apiOrders = createApi({
    reducerPath: 'api/orders',
    baseQuery: createBaseQuery('orders'),
    endpoints: (builder) => ({
        getOrders: builder.query<OrderModel[], void>({
            query: () => ({
                url: '',
            }),
        }),
    }),
});

export const {
    useGetOrdersQuery
} = apiOrders;
