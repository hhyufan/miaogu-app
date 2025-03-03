import axiosInstance from '@/axios/axiosInstance';
import store, {setExpiresIn, setRefreshToken, setToken} from "@/store/store.js";
import {encryptPassword} from "@/util/rsaEncryptor.js";

export const login = async (username, password) => {
    const state = store.getState();
    console.log(state.user.username)
    return axiosInstance.post(`/user/login`, {
        username,
        password:
            encryptPassword(password, state.edgeConfig.publicKey)}, {
        headers: {
            'Content-Type': 'application/json' // 设置为 JSON
        }
    }).then(async res => {
        if (res.data.code === 200) {
            await processToken(res.data.data)
            await store.dispatch(setExpiresIn(Date.now() + +res.data.data.expiresIn));
        }
        return res.data
    });
}

// 获取注册请求信息
export const register =async (username, password, email) => {
    const state = store.getState();
    return axiosInstance.post(`/user/register`, {
        username,
        password: encryptPassword(password, state.edgeConfig.publicKey), email},  {
        headers: {
            'Content-Type': 'application/json' // 设置为 JSON
        }
    }).then(async res => {
        if (res.data.code === 200) {
            await processToken(res.data.data)
            await store.dispatch(setExpiresIn(Date.now() + +res.data.data.expiresIn));
        }
        return res.data
    });
}

let isRefreshing = false; // 刷新锁

export const refreshToken = async () => {
    if (isRefreshing) return; // 如果正在刷新，直接返回
    isRefreshing = true;
    const state = store.getState();
    try {
        const response = await axiosInstance.post('/user/refresh', {
            username: state.user.username,
            refreshToken: state.user.refreshToken,
        });
        await store.dispatch(setToken(response.data.data.token));
        await store.dispatch(setExpiresIn(Date.now() + +response.data.data.expiresIn));
    } catch (error) {
        console.error('Failed to refresh token:', error);
    } finally {
        isRefreshing = false; // 释放锁
    }
};
export const updateToken = async () => {
    return axiosInstance.post(`/user/token`).then(
        async res => {
            await store.dispatch(setToken(res.data.data.token));
            return res.data
        }
    )
}
const processToken = async (res) => {
    await store.dispatch(setToken(res.token));
    await store.dispatch(setRefreshToken(res.refreshToken));
};

// 获取聊天信息
export const getChatMsg = async (Type, requestMessage = {}) => {
    return axiosInstance.post(`/${Type}/messages`, requestMessage, {
        headers: {
            'Content-Type': 'application/json', // 设置请求头
        }
    }).then(res => res.data);
};
// 获取聊天信息
export const getAllChatMsg = async (Type, requestMessage = {}) => {
    return axiosInstance.post(`/${Type}/message`, requestMessage, {
        headers: {
            'Content-Type': 'application/json', // 设置请求头
        }
    }).then(res => res.data);
};
export const sendChatMessage = async (chatMessage, Type) => {
    return axiosInstance.post(`/${Type}/send`, chatMessage).then(res => res.data);
};
