import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../Utilities/createBaseQuery';
import type { CartItemDto, CartItemRequestDto } from './types';

export const apiCart = createApi({
  reducerPath: 'api/cart',
  baseQuery: createBaseQuery('cart'),
  endpoints: (builder) => ({
    getCartItems: builder.query<CartItemDto[], void>({
      query: () => ({
        url: 'GetCartItems',
        method: 'GET',
      }),
    }),
    addToCart: builder.mutation<void, CartItemRequestDto>({
      query: (item) => ({
        url: 'CreateUpdate',
        method: 'POST',
        body: item,
      }),
    }),
    removeFromCart: builder.mutation<void, number>({
      query: (productVariantId) => ({
        url: `RemoveFromCart/${productVariantId}`,
        method: 'DELETE',
      }),
    }),
    orderCart: builder.mutation<void,void>({
      query: () => ({
        url: `OrderCart`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetCartItemsQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useOrderCartMutation
} = apiCart;
