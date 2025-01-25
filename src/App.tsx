import { FluentProvider } from "@fluentui/react-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import { useIsRtl } from "./locales/hooks";
import { routeTree } from "./routeTree.gen"; // generated route tree
import { store } from "./store/store";
import { getFluentTheme } from "./theme/fluent";
import { useTheme } from "./theme/hooks";

declare module "@tanstack/react-router" {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Register {
        router: typeof router;
    }
}

const queryClient = new QueryClient();

const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    context: { queryClient, store },
});

export const App: React.FC = () => {
    const theme = useTheme();
    const isRtl = useIsRtl();

    return (
        <QueryClientProvider client={queryClient}>
            <FluentProvider
                theme={getFluentTheme(theme)}
                dir={isRtl ? "rtl" : "ltr"}
                style={{ height: "100%", width: "100%" }}
            >
                <RouterProvider router={router} />
            </FluentProvider>
        </QueryClientProvider>
    );
};

export default App;
