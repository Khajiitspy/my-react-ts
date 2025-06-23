import {configureStore} from '@reduxjs/toolkit';
import {apiCategory} from "../Services/apiCategory.ts";
import authReducer from './authSlice';
export const Store = configureStore({
    reducer: {
        [apiCategory.reducerPath]: apiCategory.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiCategory.middleware),
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

