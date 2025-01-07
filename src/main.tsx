import { createRouter, RouterProvider } from "@tanstack/react-router";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { store } from "./store/store";

// Create a new router instance
const router = createRouter({
    routeTree,
    defaultPreload: "intent",
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Register {
        router: typeof router;
    }
}

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>,
);
