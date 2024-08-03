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
                validateStatus : (response: any, result: any) => {
                    return response.status === 200 && !result.isError
                }, 
            }), 
            transformResponse : responseData => {



                // @ts-expect-error TS(2571): Object is of type 'unknown'.
                const loadedUsers = responseData.map((user: any) => {
                    user.id = user._id 
                    return user
                })
                return usersAdapter.setAll(initialState, loadedUsers);
            },



            // @ts-expect-error TS(2322): Type '(result: EntityState<{ id: EntityId; }, Enti... Remove this comment to see the full error message
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




// @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data
)

export const {
    selectAll : selectAllUsers, 
    selectById : selectUserById, 
    selectIds : selectUserIds
// @ts-expect-error TS(2345): Argument of type 'unknown' is not assignable to pa... Remove this comment to see the full error message
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)