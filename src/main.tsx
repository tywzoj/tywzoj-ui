import "core-js/es/promise";
import "core-js/es/object"; // Object.entries, Object.values
import "regenerator-runtime/runtime"; // async/await
import "whatwg-fetch"; // fetch

import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";

import { ErrorBoundary } from "@/common/components/ErrorBoundary";
import { showErrorPage } from "@/common/utils/error";
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
