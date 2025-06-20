import { createApi} from '@reduxjs/toolkit/query/react';
import type {ICategoryCreate, ICategoryEdit, ICategoryItem} from "./types.ts";
import {createBaseQuery} from "../Utilities/createBaseQuery.ts";
import {serialize} from "object-to-formdata";
export const apiCategory = createApi({
    reducerPath: 'api/categories',
    baseQuery: createBaseQuery('categories'),
    endpoints: (builder) => ({
        getAllCategories: builder.query<ICategoryItem[], void>({
            query: () => '/list'
        }),
        createCategory: builder.mutation<ICategoryItem, ICategoryCreate>({
            query: (newCategory) => {
                try{
                    const formData = serialize(newCategory);
                    console.log(formData);
                    return {
                        url: '',
                        method: 'POST',
                        body: formData
                    }
                }
                catch{
                    throw new Error('Error create category');
                }
            }
        }),
        getCategoryById: builder.query<ICategoryItem, number>({
            query: (id) => `/${id}`
        }),
        editCategory: builder.mutation<ICategoryItem, ICategoryEdit>({
            query: ({ id, ...rest }) => {
                try{
                    const formData = serialize(rest);
                    console.log(formData);
                    return {
                        url: `/${id}`,
                        method: 'PUT',
                        body: formData
                    }
                }
                catch{
                    throw new Error('Error create category');
                }
            }
        }),
        deleteCategory: builder.mutation<void, number>({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE'
            })
        }),
    }),
});

export const {
    useGetAllCategoriesQuery,
    useCreateCategoryMutation,
    useGetCategoryByIdQuery,
    useEditCategoryMutation,
    useDeleteCategoryMutation
} = apiCategory;

