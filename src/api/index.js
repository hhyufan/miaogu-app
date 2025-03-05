import store, {setBaseURL, setPublicKey} from "@/store/store.js";

const localDebug = false;
const REMOTE_URL = localDebug ? "http://localhost:8088" : 'https://yuki.cmyam.net/miaogu_api';

const REMOTE_API_URL = `${REMOTE_URL}/edge-config/api/config`;
const API_URL = '/api/config';

async function fetchConfig(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch config:', error);
        throw error; // 重新抛出错误以便调用者处理
    }
}

export async function getBaseUrl() {
    const state = store.getState();

    if (state.edgeConfig.baseURL) return state.edgeConfig.baseURL; // 缓存结果
    const apiUrl = REMOTE_URL
    store.dispatch(setBaseURL(apiUrl));
    return apiUrl; // 返回更新后的 baseUrl
}

export async function getPublicKey() {
    const state = store.getState();
    if (state.edgeConfig.publicKey) return state.edgeConfig.publicKey; // 缓存结果

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const url = isLocalhost ? REMOTE_API_URL : API_URL;

    const data = await fetchConfig(url);
    const publicKey = isLocalhost ? data.find(item => item.key === 'VUE_APP_PUBLIC_KEY')?.value : data?.publicKey;
    store.dispatch(setPublicKey(publicKey));
    return publicKey; // 返回更新后的 publicKey
}

// 在应用启动时初始化 baseUrl
export async function initEdgeConfig() {
    await getPublicKey();
    await getBaseUrl();
}
