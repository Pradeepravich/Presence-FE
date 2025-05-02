import "@fontsource/sora/300.css";
import "@fontsource/sora/400.css";
import "@fontsource/sora/500.css";
import "@fontsource/sora/700.css";

import { store } from "./redux/store";
import { Provider } from "react-redux";
import Router from "./Router";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";
import ThemeConfig from "./components/ThemeConfig";
import TenantInitializer from "./components/TenantInitializer";
import ConfirmDialog from "./components/ConfirmDialogue";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <Provider store={store}>
      <ThemeConfig>
        <SnackbarProvider>
          <ErrorBoundary>
            <BrowserRouter>
              <TenantInitializer />
              <ConfirmDialog />
              <Router />
            </BrowserRouter>
          </ErrorBoundary>
        </SnackbarProvider>
      </ThemeConfig>
    </Provider>
  );
}

export default App;
