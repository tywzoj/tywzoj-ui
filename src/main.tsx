import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { showErrorPage } from "@/error/utils";
import { store } from "@/store/store";

import { AppLazy } from "./App.lazy";
import { initAsyncAction } from "./initialization";

function render() {
    createRoot(document.getElementById("root")!).render(
        <React.StrictMode>
            <ErrorBoundary>
                <Provider store={store}>
                    <HelmetProvider>
                        <React.Suspense fallback={null}>
                            <AppLazy />
                        </React.Suspense>
                    </HelmetProvider>
                </Provider>
            </ErrorBoundary>
        </React.StrictMode>,
    );
}

function launch() {
    store
        .dispatch(initAsyncAction())
        .then(() => render())
        .catch((e) => showErrorPage(e));
}

launch();
