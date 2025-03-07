import store, {setBaseURL, setPublicKey} from "@/store/store.js";

const requireEnv = (variableName) => {
    const value = import.meta.env[variableName];
    if (!value) {
        throw new Error(`${variableName} Not Empty!`);
    }
    return value;
}

const REMOTE_URL = requireEnv('VITE_REMOTE_URL');
const LOCAL_HOST = requireEnv('VITE_LOCAL_HOST');
const PUBLIC_KEY = requireEnv('VITE_PUBLIC_KEY');

export async function getBaseUrl() {
    const state = store.getState();
    if (state.edgeConfig.baseURL) return state.edgeConfig.baseURL; // 缓存结果

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const baseUrl = isLocalhost ? LOCAL_HOST : REMOTE_URL

    store.dispatch(setBaseURL(baseUrl));
    return baseUrl; // 返回更新后的 baseUrl
}

export async function getPublicKey() {
    const state = store.getState();
    if (state.edgeConfig.publicKey) return state.edgeConfig.publicKey; // 缓存结果
    store.dispatch(setPublicKey(PUBLIC_KEY));
    return PUBLIC_KEY; // 返回更新后的 publicKey
}

// 在应用启动时初始化 baseUrl
export async function initEdgeConfig() {
    await getPublicKey();
    await getBaseUrl();
}
