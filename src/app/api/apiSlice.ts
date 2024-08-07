import { createApi, fetchBaseQuery, RootState } from '@reduxjs/toolkit/query/react';
import { setCredentials } from '../../features/auth/authSlice';

interface RefreshResult {
    accessToken : string
};

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3500',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {



        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        const token = (getState() as RootState).auth.token

        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {

    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.status === 403) {
        console.log('sending refresh token')

        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        if (refreshResult?.data) {
            api.dispatch(setCredentials({ ...refreshResult.data as {accessToken: string} }))
            result = await baseQuery(args, api, extraOptions)
        } else {

            if (refreshResult?.error?.status === 403) {
                type DataType = {
                    [key:string]: any
                }
                (refreshResult.error.data as DataType).message = "Your login has expired."
            }
            return refreshResult
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User'],
    reducerPath: 'baseApi',
    endpoints: builder => ({})
})