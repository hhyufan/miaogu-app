import store, {setBaseURL, setPublicKey} from "@/store/store.js";

const LOCALHOST_URL = 'http://localhost:8088';
const LOCALHOST_API_URL = `${LOCALHOST_URL}/edge-config/api/config`;
const API_URL = '/api/config';

async function fetchConfig(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch config:', error);
        // throw error; // 重新抛出错误以便调用者处理
    }
}

export async function getBaseUrl() {
    const state = store.getState();

    if (state.edgeConfig.baseURL) return state.edgeConfig.baseURL; // 缓存结果
    console.log(window.location.hostname)
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('.ngrok-free.app');
    const url = isLocalhost ? LOCALHOST_URL : API_URL;

    const data = await fetchConfig(url);
    const apiUrl = isLocalhost ? LOCALHOST_URL : data.apiUrl;
    console.log(apiUrl)
    store.dispatch(setBaseURL(apiUrl));
    return apiUrl; // 返回更新后的 baseUrl
}

export async function getPublicKey() {
    const state = store.getState();

    if (state.edgeConfig.publicKey) return state.edgeConfig.publicKey; // 缓存结果

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const url = isLocalhost ? LOCALHOST_API_URL : API_URL;

    const data = await fetchConfig(url);
    const publicKey = isLocalhost ? data.find(item => item.key === 'VUE_APP_PUBLIC_KEY')?.value : data?.publicKey;
    console.log(publicKey)
    store.dispatch(setPublicKey(publicKey));
    return publicKey; // 返回更新后的 publicKey
}

// 在应用启动时初始化 baseUrl
export async function initEdgeConfig() {

    // store.subscribe(() => {
    //     const state = store.getState();
    //     console.log("Redux state updated:", state.edgeConfig);
    // });

    await getPublicKey();
    await getBaseUrl();
}
