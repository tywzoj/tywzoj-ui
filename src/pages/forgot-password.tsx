import { createFileRoute } from "@tanstack/react-router";

import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/locale";

const ForgotPasswordPage: React.FC = () => {
    const ls = useLocalizedStrings({
        $title: CE_Strings.NAVIGATION_FORGOT_PASSWORD,
    });

    useSetPageTitle(ls.$title);

    return <div></div>;
};

export const Route = createFileRoute("/forgot-password")({
    component: ForgotPasswordPage,
});
