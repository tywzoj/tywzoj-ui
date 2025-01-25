import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import { showErrorPage } from "./error/utils";
import { initAsyncAction } from "./initialization";
import { store } from "./store/store";

function launch() {
    store
        .dispatch(initAsyncAction())
        .then(() => {
            createRoot(document.getElementById("root")!).render(
                <React.StrictMode>
                    <Provider store={store}>
                        <App />
                    </Provider>
                </React.StrictMode>,
            );
        })
        .catch((error) => {
            showErrorPage(error);
        });
}

launch();
