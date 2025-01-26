import { RouterProvider } from "@tanstack/react-router";

import { useRecaptchaAsync } from "@/common/hooks/recaptcha";

import { router } from "./router";

export const AppRouterProvider: React.FC = () => {
    const recaptchaAsync = useRecaptchaAsync();

    return (
        <RouterProvider
            router={router}
            context={{
                recaptchaAsync,
            }}
        />
    );
};
