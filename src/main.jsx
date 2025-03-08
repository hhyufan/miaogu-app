import { CProvider } from "@/components/ui/c-provider.jsx"
import { Provider as RProvider }  from 'react-redux';
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import store, {persistor} from "@/store/store.js";
import {ConfigProvider} from "react-vant";
import {PersistGate} from "redux-persist/integration/react";
(async () => {

    createRoot(document.getElementById("root")).render(
        <StrictMode>
            <RProvider store={store}>
                <PersistGate
                    loading={null} // 可以自定义加载时的 UI
                    persistor={persistor}
                >
                    <ConfigProvider>
                        <CProvider>
                            <App />
                        </CProvider>
                    </ConfigProvider>
                </PersistGate>
            </RProvider>
        </StrictMode>,
    )
})()
