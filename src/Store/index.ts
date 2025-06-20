import {configureStore} from '@reduxjs/toolkit';
import {apiCategory} from "../Services/apiCategory.ts";
export const Store = configureStore({
    reducer: {
        [apiCategory.reducerPath]: apiCategory.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiCategory.middleware),
});