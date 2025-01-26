import { createFileRoute } from "@tanstack/react-router";

import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";

const SignUpPage: React.FC = () => {
    const ls = useLocalizedStrings({
        title: CE_Strings.NAVIGATION_SIGN_UP,
    });

    useSetPageTitle(ls.title);

    return <div></div>;
};

export const Route = createFileRoute("/sign-up")({
    component: SignUpPage,
    errorComponent: ErrorPageLazy,
});
