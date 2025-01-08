import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { initAction, initSessionInfoAsyncAction } from "./init";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { store } from "./store/store";

const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    context: { queryClient, store },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Register {
        router: typeof router;
    }
}

function launch() {
    store.dispatch(initAction());
    store.dispatch(initSessionInfoAsyncAction());
    createRoot(document.getElementById("root")!).render(
        <React.StrictMode>
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router} />
                </QueryClientProvider>
            </Provider>
        </React.StrictMode>,
    );
}

launch();
