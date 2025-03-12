import {combineReducers, configureStore, createAction, createSlice} from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// 创建重置状态的Action
export const resetState = createAction('RESET_STATE');

const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        username: '',
        token: '',
        refreshToken: '',
        expiresIn: '',
        userInfo: {}
    },
    reducers: {
        setIsLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
        },
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
            state.publicKey = action.payload;
        }
    }
});

const chatModelSlice = createSlice({
    name: 'chatModel',
    initialState: {
        id: "1002",
        avatar: null, // 图片引用会在组件中设置
        detail: 'gpt-3.5-turbo',
        selectedColor: '#9c81ed'
    },
    reducers: {
        setModelId: (state, action) => {
            state.id = action.payload;
        },
        setModelAvatar: (state, action) => {
            state.avatar = action.payload;
        },
        setModelDetail: (state, action) => {
            state.detail = action.payload;
        },
        setSelectedColor: (state, action) => {
            state.selectedColor = action.payload;
        },
        setCurrentModel: (state, action) => {
            const { id, avatar, detail } = action.payload;
            state.id = id;
            state.avatar = avatar;
            state.detail = detail;
        }
    }
});

// 合并Reducer
const appReducer = combineReducers({
    user: userSlice.reducer,
    edgeConfig: edgeConfigSlice.reducer,
    chatModel: chatModelSlice.reducer
});

// 根Reducer，处理重置逻辑
const rootReducer = (state, action) => {
    if (action.type === resetState.type) {
        return appReducer(undefined, action); // 重置所有状态为初始值
    }
    return appReducer(state, action);
};

// Redux-persist配置
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'edgeConfig', 'chatModel'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
});

export const {
    setIsLoggedIn,
    setReduxUsername,
    setToken,
    setRefreshToken,
    setExpiresIn,
    setUserInfo
} = userSlice.actions;
export const {
    setBaseURL,
    setPublicKey
} = edgeConfigSlice.actions;

export const {
    setModelId,
    setModelAvatar,
    setModelDetail,
    setSelectedColor,
    setCurrentModel
} = chatModelSlice.actions;

export const persistor = persistStore(store);

export default store;
