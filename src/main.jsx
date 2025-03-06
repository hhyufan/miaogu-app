import { CProvider } from "@/components/ui/c-provider.jsx"
import { Provider as RProvider }  from 'react-redux';
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import store from "@/store/store.js";
import {initEdgeConfig} from "@/api/index.js";
import {ConfigProvider} from "react-vant";
(async () => {
    await initEdgeConfig()
    createRoot(document.getElementById("root")).render(
        <StrictMode>
            <RProvider store={store}>
                <ConfigProvider>
                    <CProvider>
                        <App />
                    </CProvider>
                </ConfigProvider>
            </RProvider>
        </StrictMode>,
    )
})()
