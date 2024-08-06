import { apiSlice } from "../../app/api/apiSlice";
import {
    createSelector, 
    createEntityAdapter,
    EntityState
} from '@reduxjs/toolkit' 
import { AtLeastOne, User } from "../../services/helpers";
import { RootState } from "../../app/store";
const usersAdapter = createEntityAdapter<NewUser>({});
const initialState = usersAdapter.getInitialState();

type AddNewUserPayload = {
    email: string, 
    password: string, 
    username?: string
};

type toUpdate = {
    username?: string,
    email?: string, 
    password?: string, 
    roles?: {
        [key: string] : number
    }
};

type UpdateUserPayload = {
    toUpdate: AtLeastOne<toUpdate>, 
    email: string, 
    username: string, 
    id: string
};

type DeleteUserPayload = {
    id: string
};

type NewUser = User & {
    id: string
};

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints : builder => ({
        getUsers: builder.query<EntityState<NewUser, string>, string | void>({
            query : () => ({
                url : '/users', 
                validateStatus : (response: any, result: any) => {
                    return response.status === 200 && !result.isError
                }, 
            }), 
            transformResponse : (responseData: User[]) => {
                const loadedUsers: NewUser[] = responseData.map((user: User) => {
                    return {...user, id: user._id}
                })
                return usersAdapter.setAll(initialState, loadedUsers);
            },
            providesTags : (result) => {
                if (!result) return [{ type: "User", id: 'LIST' }]
                if(result?.ids){
                    return [
                        {type : 'User', id : 'LIST'}, 
                        ...result.ids.map(id => ({type: 'User' as const, id}))
                    ]
                }
                else return [{type : 'User', id : 'LIST'}]
            }, 
            
        }) , 
        addNewUser : builder.mutation<void, AddNewUserPayload>({
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
        updateUser : builder.mutation<void, UpdateUserPayload>({
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
        deleteUser : builder.mutation<void, DeleteUserPayload>({
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
} = usersAdapter.getSelectors((state: RootState) => selectUsersData(state) ?? initialState)