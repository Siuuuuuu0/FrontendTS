import { apiSlice } from "../../app/api/apiSlice";
import { logOut } from "../auth/authSlice";
import { setAccount } from "./accountSlice";

export const accountApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        updateAccount: builder.mutation({
            query: initialUserData => ({
                url: '/update',
                method: 'PATCH',
                body: {
                    ...initialUserData
                }
            })
        }),
        deleteAccount: builder.mutation({
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
        getAccount: builder.query({
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
        confirmUpdatePassword : builder.mutation({
            query : ({token}) => ({
                url : `/update/update-password?token=${token}`, 
                method : 'PATCH', 
            }),
        }), 
        confirmUpdateEmail : builder.mutation({
            query : ({token}) => ({
                url : `/update/update-email?token=${token}`, 
                method : 'PATCH', 
            })
        }), 
        uploadProfilePicture :  builder.mutation({
            query : formData => ({
                url : '/account/upload-profile-picture', 
                method : 'POST', 
                body : formData
            })
        }), 
        deleteProfilePicture : builder.mutation({
            query : id => ({
                url : '/account/delete-profile-picture', 
                method : 'POST', 
                body : {...id}
            })
        }), 
        changeProfilePicture : builder.mutation({
            query : formData => ({
                url : '/account/change-profile-picture', 
                method : 'POST', 
                body : formData
            }) 
        }), 
        getProfilePicture : builder.mutation({
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
