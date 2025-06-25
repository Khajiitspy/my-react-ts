import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../Utilities/createBaseQuery.ts';
import type {Product, ProductDetailsDto} from "./types.ts";

export const apiProduct = createApi({
    reducerPath: 'api/products',
    baseQuery: createBaseQuery('products'), // ✅ Correct base path
    endpoints: (builder) => ({
        getProducts: builder.query<{
            items: Product[],
            totalItems: number
        }, { search?: string, page?: number, pageSize?: number }>({
            query: ({ search = '', page = 1, pageSize = 6 }) => ({
                url: 'list',
                params: { search, page, pageSize }
            }),
        }),
        getProductById: builder.query<ProductDetailsDto, number>({
            query: (id) => `/${id}`
        }),
    }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = apiProduct;
