import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
    token: string | null;
    userOrMail: string | null;
    googleId: string | null;
};

const initialState: InitialState = {
    token: null,
    userOrMail: null,
    googleId: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state: InitialState, action: PayloadAction<{ accessToken: string }>) => {
            const { accessToken } = action.payload;
            state.token = accessToken;
        },
        logOut: (state: InitialState) => {
            state.token = null;
            state.userOrMail = null;
            state.googleId = null;
        },
        setEmailOrUser: (state: InitialState, action: PayloadAction<{ userOrMail: string }>) => {
            const { userOrMail } = action.payload;
            state.userOrMail = userOrMail;
        },
        setGoogleId: (state: InitialState, action: PayloadAction<{ googleId: string }>) => {
            const { googleId } = action.payload;
            state.googleId = googleId;
        }
    }
});

export const { setCredentials, logOut, setEmailOrUser, setGoogleId } = authSlice.actions;

export default authSlice.reducer;

type RootState = {
    auth: InitialState;
};

export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentGoogleId = (state: RootState) => state.auth.googleId;
export const selectCurrentUserOrMail = (state: RootState) => state.auth.userOrMail;
