import "@/assets/styles/scrollbar.css";

import { FluentProvider } from "@fluentui/react-components";
import { QueryClientProvider } from "@tanstack/react-query";

import { RecaptchaProvider } from "@/common/providers/RecaptchaProvider";
import { useIsRtl } from "@/locales/hooks";
import { queryClient } from "@/query/client";
import { AppRouterProvider } from "@/router/AppRouterProvider";
import { getFluentTheme } from "@/theme/fluent";
import { useTheme } from "@/theme/hooks";

import { IconProvider } from "./common/providers/IconProvider";
import { PageTitleProvider } from "./common/providers/PageTitleProvider";
import { ToastProvider } from "./common/providers/ToastProvider";

export const App: React.FC = () => {
    const theme = useTheme();
    const isRtl = useIsRtl();

    return (
        <RecaptchaProvider>
            <QueryClientProvider client={queryClient}>
                <FluentProvider
                    theme={getFluentTheme(theme)}
                    dir={isRtl ? "rtl" : "ltr"}
                    style={{ height: "100%", width: "100%" }}
                >
                    <PageTitleProvider />
                    <IconProvider />
                    <ToastProvider>
                        <AppRouterProvider />
                    </ToastProvider>
                </FluentProvider>
            </QueryClientProvider>
        </RecaptchaProvider>
    );
};

export default App;
