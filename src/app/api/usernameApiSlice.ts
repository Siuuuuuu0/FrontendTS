import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type UsernamesResponse = {
    usernames: string[]
}

type UsernamesPayload = {
    first_name: string, 
    last_name: string
}

type AddUsernamePayload = {
    username: string
}

const baseQueryForUsernames = fetchBaseQuery({
    baseUrl: 'http://localhost:5000', 
    credentials: 'include',
})

export const usernamesApiSlice = createApi({
    baseQuery: baseQueryForUsernames,
    reducerPath : 'usernameApi',
    endpoints: builder => ({
        getUsernames: builder.mutation<UsernamesResponse, UsernamesPayload>({
            query: names => ({
                url: '/generate_usernames',
                method: 'POST', 
                body : {...names}
            })
        }), 
        addUsername : builder.mutation<void, AddUsernamePayload>({
            query : username => ({
                url : '/add_username', 
                method : 'POST', 
                body : {...username} 
            })
        })
    })
})

export const { useGetUsernamesMutation, useAddUsernameMutation } = usernamesApiSlice
