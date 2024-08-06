import { apiSlice } from "../../app/api/apiSlice";
import { logOut } from "../auth/authSlice";
import { setAccount } from "./accountSlice";
import { AtLeastOne, User } from "../../services/helpers";


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
type DeleteProfilePicturePayload = AtLeastOne<{ id: string, userId: string }>;
type ChangeProfilePicturePayload = FormData;
type GetProfilePicturePayload = { id: string };

export type ProfilePictureResponse = {
    id: string;
    image: string;
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
        updateAccount: builder.mutation<void, UpdateAccountPayload>({
            query: initialUserData => ({
                url: '/update',
                method: 'PATCH',
                body: {
                    ...initialUserData
                }
            })
        }),
        deleteAccount: builder.mutation<void, DeleteAccountPayload>({
            query: ({ id }) => ({
                url: `/update`,
                method: 'DELETE',
                body : {id}
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(setAccount(null));

                    dispatch(logOut())
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState())
                    }, 1000)
                } catch (err) {
                    console.log(err);
                }
            }
        }),
        getAccount: builder.query<User, GetAccountPayload>({
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
        deleteProfilePicture : builder.mutation<void, DeleteProfilePicturePayload>({
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
