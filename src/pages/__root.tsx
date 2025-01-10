import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type React from "react";

import type { IAppStore } from "@/store/types";

const Layout: React.FC = () => {
    return (
        <div>
            <h1>My App</h1>
            <div>
                <Outlet />
            </div>
        </div>
    );
};

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient;
    store: IAppStore;
}>()({
    component: Layout,
});
