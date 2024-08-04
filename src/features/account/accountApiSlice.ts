import { apiSlice } from "../../app/api/apiSlice";
import { logOut } from "../auth/authSlice";
import { setAccount } from "./accountSlice";

type AtLeastOne<T> = {
    [K in keyof T]: Pick<T, K> & Partial<Omit<T, K>>;
}[keyof T];


// Type Parameter T:

// AtLeastOne is a generic type that takes a type parameter T.
// Mapped Type:

// [K in keyof T]: is a mapped type. It iterates over each key K in the type T.
// Pick and Partial:

// Pick<T, K>: This utility type creates a new type by picking the key K from T and making it required.
// Partial<Omit<T, K>>: This creates a new type by omitting the key K from T and making all other keys optional.
// Pick<T, K> & Partial<Omit<T, K>>: This creates a new type where the key K is required, and all other keys are optional. The & operator combines these two types.
// Union of All Possible Mapped Types:

// { [K in keyof T]: ... }[keyof T]: This constructs a union type of all the possible mapped types created in the previous step.
// By indexing the mapped type with [keyof T], we get a union of all the types where each key K from T is made required one by one.

type UpdateAccountPayload = {
    id: string, 
    toUpdate : AtLeastOne<{
        email?: string, 
        password?: string, 
        username?: string
    }>
};
type DeleteAccountPayload = { id: string };
type GetAccountPayload = { id: string };
type ConfirmUpdatePasswordPayload = { token: string };
type ConfirmUpdateEmailPayload = { token: string };
type UploadProfilePicturePayload = FormData;
type DeleteProfilePicturePayload = { id: string };
type ChangeProfilePicturePayload = FormData;
type GetProfilePicturePayload = { id: string };

export type ProfilePictureResponse = {
    id: string;
    image: string;
};

type UserResponse = {
    username : string, 
    email : string, 
    firstName : string, 
    lastName : string, 
    roles : {
        [key:string]: number
    }, 
    _id : string, 
    googleId?:string,
    logIns?:string[], 
    [key:string]:any
};

type UpdateConfirmResponse = {
    accessToken : string, 
    account : {
        email: string, 
        username: string, 
        id: string
    }
}

export const accountApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        updateAccount: builder.mutation<any, UpdateAccountPayload>({
            query: initialUserData => ({
                url: '/update',
                method: 'PATCH',
                body: {
                    ...initialUserData
                }
            })
        }),
        deleteAccount: builder.mutation<any, DeleteAccountPayload>({
            query: ({ id }) => ({
                url: `/update`,
                method: 'DELETE',
                body : {id}
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(setAccount(null));



                    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
                    dispatch(logOut())
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState())
                    }, 1000)
                } catch (err) {
                    console.log(err);
                }
            }
        }),
        getAccount: builder.query<UserResponse, GetAccountPayload>({
            query: ({ id }) => ({
                url: `/users/:${id}`,
                method: 'GET'
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setAccount(data));
                } catch (err) {
                    console.log(err);
                }
            }
        }), 
        confirmUpdatePassword : builder.mutation<UpdateConfirmResponse, ConfirmUpdatePasswordPayload>({
            query : ({token}) => ({
                url : `/update/update-password?token=${token}`, 
                method : 'PATCH', 
            }),
        }), 
        confirmUpdateEmail : builder.mutation<UpdateConfirmResponse, ConfirmUpdateEmailPayload>({
            query : ({token}) => ({
                url : `/update/update-email?token=${token}`, 
                method : 'PATCH', 
            })
        }), 
        uploadProfilePicture :  builder.mutation<ProfilePictureResponse, UploadProfilePicturePayload>({
            query : formData => ({
                url : '/account/upload-profile-picture', 
                method : 'POST', 
                body : formData
            })
        }), 
        deleteProfilePicture : builder.mutation<any, DeleteProfilePicturePayload>({
            query : id => ({
                url : '/account/delete-profile-picture', 
                method : 'POST', 
                body : {...id}
            })
        }), 
        changeProfilePicture : builder.mutation<ProfilePictureResponse, ChangeProfilePicturePayload>({
            query : formData => ({
                url : '/account/change-profile-picture', 
                method : 'POST', 
                body : formData
            }) 
        }), 
        getProfilePicture : builder.mutation<ProfilePictureResponse, GetProfilePicturePayload>({
            query: id => ({
                url: '/account/get-profile-picture',
                method: 'POST',
                body : {...id}
            }),
        }),
    })
});

export const {
    useUpdateAccountMutation,
    useDeleteAccountMutation,
    useGetAccountQuery, 
    useConfirmUpdatePasswordMutation, 
    useConfirmUpdateEmailMutation, 
    useUploadProfilePictureMutation, 
    useDeleteProfilePictureMutation, 
    useChangeProfilePictureMutation, 
    useGetProfilePictureMutation
} = accountApiSlice;
