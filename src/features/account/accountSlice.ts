import { createSlice } from '@reduxjs/toolkit';

type InititialStateType = {
    account : {
        email: string, 
        username: string, 
        id: string
    } | null
}

const initialState: InititialStateType = {
    account: null
};

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setAccount(state, action) {
            state.account = action.payload;
        },
        clearAccount(state) {
            state.account = null;
        }
    }
});

export const { setAccount, clearAccount } = accountSlice.actions;

export default accountSlice.reducer;
