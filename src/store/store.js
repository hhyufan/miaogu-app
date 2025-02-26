import { configureStore, createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        username: ''
    },
    reducers: {
        setReduxUsername: (state, action) => {
            state.username = action.payload;
        }
    }
});

export const { setReduxUsername } = userSlice.actions;

const store = configureStore({
    reducer: {
        user: userSlice.reducer
    }
});

export default store;
