import { RouterProvider } from "@tanstack/react-router";

import { useRecaptchaAsync } from "@/common/hooks/recaptcha";
import { NavigatingProgressBar } from "@/components/GlobalProcessBar";
import { usePermission } from "@/permission/common/hooks";
import { useCurrentUser } from "@/store/hooks";

import { router } from "./router";

export const AppRouterProvider: React.FC = () => {
    const recaptchaAsync = useRecaptchaAsync();
    const currentUser = useCurrentUser();
    const permission = usePermission();

    return (
        <>
            <NavigatingProgressBar router={router} />
            <RouterProvider
                router={router}
                context={{
                    recaptchaAsync,
                    currentUser,
                    permission,
                }}
            />
        </>
    );
};
