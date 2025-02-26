import { configureStore, createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        username: '',
        token: '',
        refreshToken: '',
        expiresIn: '',
        userInfo: {}
    },
    reducers: {
        setReduxUsername: (state, action) => {
            state.username = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setRefreshToken: (state, action) => {
            state.refreshToken = action.payload;
        },
        setExpiresIn: (state, action) => {
            state.expiresIn = action.payload;
        },
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        }
    }
});

const edgeConfigSlice = createSlice({
    name: 'edgeConfig',
    initialState: {
        baseURL: '',
        publicKey: ''
    },
    reducers: {
        setBaseURL: (state, action) => {
            state.baseURL = action.payload;
        },
        setPublicKey: (state, action) => {
            // console.log("Updating publicKey:", action.payload);
            state.publicKey = action.payload;
        }
    }
})

export const {
    setReduxUsername ,
    setToken,
    setRefreshToken,
    setExpiresIn,
    setUserInfo
} = userSlice.actions;
export const {
    setBaseURL,
    setPublicKey
} = edgeConfigSlice.actions;

const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        edgeConfig: edgeConfigSlice.reducer
    }
});

export default store;
