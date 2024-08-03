import { apiSlice } from "../../app/api/apiSlice"
import { logOut, setCredentials } from "./authSlice"

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    console.log(data)



                    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
                    dispatch(logOut())
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState())
                    }, 1000)
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET',
                
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    console.log(data)
                    const { accessToken } = data
                    dispatch(setCredentials({ accessToken }))
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        register: builder.mutation({
            query : initialUserData => ({
                url : 'auth/register', 
                method : 'POST', 
                body : { ...initialUserData }
            })

        }), 
        confirmCode : builder.mutation({
            query : code => ({
                url : 'auth/verify', 
                method : 'POST', 
                body : { ...code }
            })
        }), 
        confirmRegister : builder.mutation({
            query : ({token}) => ({
                url : `/auth/register/confirm-registration?token=${token}`, 
                method : 'POST'
            }),
        }), 
        completeRegister : builder.mutation({
            query: credentials => ({
                url: '/auth/register/complete-registration',
                method: 'POST',
                body: { ...credentials }
            })
        }), 
        googleLogin : builder.mutation({
            query : credentials => ({
                url : '/auth/google', 
                method : 'POST', 
                body : { ...credentials} 
            })
        }), 
        resetPassword : builder.mutation({
            query : credentials =>({
                url : '/reset', 
                method : 'POST', 
                body : {...credentials}
            })
        }), 
        confirmResetPassword : builder.mutation({
            query : ({password, token}) => ({
                url : `/reset/confirm?token=${token}`, 
                method : 'POST', 
                body : {password}
            })
        })
    })
})

export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation,
    useRegisterMutation, 
    useConfirmCodeMutation, 
    useConfirmRegisterMutation, 
    useCompleteRegisterMutation, 
    useGoogleLoginMutation, 
    useResetPasswordMutation, 
    useConfirmResetPasswordMutation
} = authApiSlice 