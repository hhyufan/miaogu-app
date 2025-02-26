import { CProvider } from "@/components/ui/c-provider.jsx"
import { Provider as RProvider }  from 'react-redux';
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import store from "@/store/store.js";
createRoot(document.getElementById("root")).render(
  <StrictMode>
      <RProvider store={store}>
          <CProvider>
              <App />
          </CProvider>
      </RProvider>
  </StrictMode>,
)
