import { apiSlice } from "../../app/api/apiSlice"
import { logOut, setCredentials } from "./authSlice"

type LoginPayload = {
    userOrMail: string, 
    password: string
}
type RegisterPayload = {
    email: string
}
type ConfirmCodePayload = {
    userOrMail: string, 
    code: string
}
type ConfirmRegisterPayload = {
    token: string
}
type CompleteRegisterPayload = {
    email: string, 
    password: string, 
    username?: string, 
    googleId?: string, 
    firstName: string, 
    lastName: string
}
type GoogleLoginPayload = {
    email: string, 
    name: string, 
    googleId: string
}
type ResetPasswordPayload = {
    userOrMail: string
}
type ConfirmResetPasswordPayload = {
    password: string, 
    token: string
}
export type ConfirmResponse = {
    accessToken : string, 
    id: string
}
type ConfirmRegistrationResponse = {
    email: string
}
type RefreshResponse = {
    accessToken: string
}
export type GL = {
    toRegister: boolean, 
    email: string, 
    googleId: string
}
export type GoogleLoginResponse = ConfirmResponse | GL

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation<void, LoginPayload>({
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        sendLogout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    console.log(data)

                    dispatch(logOut())
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState())
                    }, 1000)
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        refresh: builder.mutation<RefreshResponse, void>({
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
        register: builder.mutation<void, RegisterPayload>({
            query : initialUserData => ({
                url : 'auth/register', 
                method : 'POST', 
                body : { ...initialUserData }
            })

        }), 
        confirmCode : builder.mutation<ConfirmResponse, ConfirmCodePayload>({
            query : code => ({
                url : 'auth/verify', 
                method : 'POST', 
                body : { ...code }
            })
        }), 
        confirmRegister : builder.mutation<ConfirmRegistrationResponse, ConfirmRegisterPayload>({
            query : ({token}) => ({
                url : `/auth/register/confirm-registration?token=${token}`, 
                method : 'POST'
            }),
        }), 
        completeRegister : builder.mutation<ConfirmResponse, CompleteRegisterPayload>({
            query: credentials => ({
                url: '/auth/register/complete-registration',
                method: 'POST',
                body: { ...credentials }
            })
        }), 
        googleLogin : builder.mutation<GoogleLoginResponse, GoogleLoginPayload>({
            query : credentials => ({
                url : '/auth/google', 
                method : 'POST', 
                body : { ...credentials} 
            })
        }), 
        resetPassword : builder.mutation<void, ResetPasswordPayload>({
            query : credentials =>({
                url : '/reset', 
                method : 'POST', 
                body : {...credentials}
            })
        }), 
        confirmResetPassword : builder.mutation<void, ConfirmResetPasswordPayload>({
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