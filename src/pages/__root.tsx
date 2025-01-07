import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import type React from "react";

const Layout: React.FC = () => {
    return (
        <div>
            <h1>My App</h1>
            <div>
                <Outlet />
            </div>
            <TanStackRouterDevtools />
        </div>
    );
};

export const Route = createRootRoute({
    component: Layout,
});
