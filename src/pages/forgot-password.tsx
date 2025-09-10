import { createFileRoute } from "@tanstack/react-router";

import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { useLocalizedStrings } from "@/locales/hooks";

const ForgotPasswordPage: React.FC = () => {
    const ls = useLocalizedStrings();

    useSetPageTitle(ls.$NAVIGATION_FORGOT_PASSWORD);

    return <div></div>;
};

export const Route = createFileRoute("/forgot-password")({
    component: ForgotPasswordPage,
});
