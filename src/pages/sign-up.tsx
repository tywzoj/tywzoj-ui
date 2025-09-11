import { createFileRoute } from "@tanstack/react-router";

import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { useLocalizedStrings } from "@/locales/hooks";

const SignUpPage: React.FC = () => {
    const ls = useLocalizedStrings();

    useSetPageTitle(ls.$NAVIGATION_SIGN_UP);

    return <div></div>;
};

export const Route = createFileRoute("/sign-up")({
    component: SignUpPage,
    errorComponent: ErrorPageLazy,
});
