import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";

import { showErrorPage } from "@/error/utils";
import { store } from "@/store/store";

import { AppLazy } from "./App.lazy";
import { initAsyncAction } from "./initialization";

function launch() {
    store
        .dispatch(initAsyncAction())
        .then(() => {
            createRoot(document.getElementById("root")!).render(
                <React.StrictMode>
                    <Provider store={store}>
                        <HelmetProvider>
                            <React.Suspense fallback={null}>
                                <AppLazy />
                            </React.Suspense>
                        </HelmetProvider>
                    </Provider>
                </React.StrictMode>,
            );
        })
        .catch((error) => {
            showErrorPage(error);
        });
}

launch();
