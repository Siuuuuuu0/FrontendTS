import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQueryForUsernames = fetchBaseQuery({
    baseUrl: 'http://localhost:5000', 
    credentials: 'include',
})

export const usernamesApiSlice = createApi({
    baseQuery: baseQueryForUsernames,
    reducerPath : 'usernameApi',
    endpoints: builder => ({
        getUsernames: builder.mutation({
            query: names => ({
                url: '/generate_usernames',
                method: 'POST', 
                body : {...names}
            })
        }), 
        addUsername : builder.mutation({
            query : username => ({
                url : '/add_username', 
                method : 'POST', 
                body : {...username} 
            })
        })
    })
})

export const { useGetUsernamesMutation, useAddUsernameMutation } = usernamesApiSlice
