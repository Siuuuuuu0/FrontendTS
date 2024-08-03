import { apiSlice } from "../../app/api/apiSlice";
import {
    createSelector, 
    createEntityAdapter
} from '@reduxjs/toolkit' 
const usersAdapter = createEntityAdapter({}); 
const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints : builder => ({
        getUsers: builder.query({
            query : () => ({
                url : '/users', 
                validateStatus : (response, result) => {
                    return response.status === 200 && !result.isError
                }, 
            }), 
            transformResponse : responseData => {
                const loadedUsers = responseData.map(user=>{
                    user.id = user._id 
                    return user
                })
                return usersAdapter.setAll(initialState, loadedUsers);
            },
            providesTags : (result, error, arg) => {
                if(result?.ids){
                    return [
                        {type : 'User', id : 'LIST'}, 
                        ...result.ids.map(id => ({type: 'User', id}))
                    ]
                }
                else return [{type : 'User', id : 'LIST'}]
            }, 
            
        }) , 
        addNewUser : builder.mutation({
            query : initialUserData => ({
                url : '/users', 
                method : 'POST', 
                body : {
                    ...initialUserData
                }
            }), 
            invalidatesTags : [
                {type : 'User', id : 'LIST'}
            ]
        }), 
        updateUser : builder.mutation({
            query : initialUserData => ({
                url : '/users', 
                method : 'PATCH', 
                body : {
                    ...initialUserData
                }, 
            }), 
            invalidatesTags : (result, error, arg)=>[
                {type : 'User', id : arg.id}
            ]
        }), 
        deleteUser : builder.mutation({
            query : ({id}) => ({
                url : '/users', 
                method : 'DELETE', 
                body : {id}
            }), 
            invalidatesTags : (result, error, arg) => [
                {type : 'User', id : arg.id}
            ]
        }), 
        // getUser : builder.query({  
        //     query : ({id})=> ({
        //         url : `/users/:{id}`, 
        //         method : 'GET', 
        //         body : {id}
        //     }), 
        //     transformResponse: (responseData) => {
        //         // Map responseData to add the id field if needed
        //         responseData.id = responseData._id;
        //         return responseData;
        //     },
        //     providesTags: (result, error, arg) => [
        //         { type: 'User', id: arg },  // Provide a tag for the specific user fetched
        //     ],
            
        // }) 

        //IF THE DATASET IS BIG, THEN HANDLE SPECIFIC USER SEARCHES ON THE BACKEND, HOWEVER HERE MORE APPROPRIATE TO SEARCH ON THE FRONTEND
    })
})

export const {
    useGetUsersQuery,
    useAddNewUserMutation, 
    useUpdateUserMutation, 
    useDeleteUserMutation
} = usersApiSlice

export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data
)

export const {
    selectAll : selectAllUsers, 
    selectById : selectUserById, 
    selectIds : selectUserIds
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)