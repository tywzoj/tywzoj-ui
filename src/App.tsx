import { FluentProvider } from "@fluentui/react-components";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";

import { useIsRtl } from "./locales/hooks";
import { queryClient, router } from "./router/router";
import { getFluentTheme } from "./theme/fluent";
import { useTheme } from "./theme/hooks";

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
