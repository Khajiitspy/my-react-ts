import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../Utilities/createBaseQuery.ts';
import type {IProductCreate, Product, ProductDetailsDto, ProductIngredientModel, ProductSizeModel} from "./types.ts";
import {serialize} from "object-to-formdata";

export const apiProduct = createApi({
    reducerPath: 'api/products',
    baseQuery: createBaseQuery('products'),
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
        addProduct: builder.mutation<void, IProductCreate>({
            query: (product) => {
                const formData = serialize(product, { indices: false });

                return {
                    url: "create",
                    method: "POST",
                    body: formData,
                };
            },
        }),
        getIngredients: builder.query<ProductIngredientModel[], void>({
            query: () => {

                return {
                    url: "ingredients",
                    method: "GET"
                };
            }
        }),
        getSizes: builder.query<ProductSizeModel[], void>({
            query: () => {

                return {
                    url: "sizes",
                    method: "GET"
                };
            }
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useAddProductMutation,
    useGetIngredientsQuery,
    useGetSizesQuery
} = apiProduct;
