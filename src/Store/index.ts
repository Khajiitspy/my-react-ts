import {configureStore} from '@reduxjs/toolkit';
import {apiCategory} from "../Services/apiCategory.ts";
import authReducer from './authSlice';
import {apiAccount} from "../Services/apiAccount.ts";
import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {apiProduct} from "../Services/apiProduct.ts";
export const Store = configureStore({
    reducer: {
        [apiCategory.reducerPath]: apiCategory.reducer,
        [apiAccount.reducerPath]: apiAccount.reducer,
        [apiProduct.reducerPath]: apiProduct.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiCategory.middleware, apiAccount.middleware, apiProduct.middleware),
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

