import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { apiSlice } from './api/apiSlice'
import { setupListeners } from "@reduxjs/toolkit/query"
import authReducer from '../features/auth/authSlice'
import accountReducer from '../features/account/accountSlice'
import { usernamesApiSlice } from "./api/usernameApiSlice"


const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    account: accountReducer,
    [usernamesApiSlice.reducerPath]: usernamesApiSlice.reducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => {
        const allMiddleware = [apiSlice.middleware, usernamesApiSlice.middleware]
        return getDefaultMiddleware().concat(
        ...allMiddleware
        );
    },
    devTools: true
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof rootReducer>;