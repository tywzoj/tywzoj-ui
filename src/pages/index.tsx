import { createFileRoute } from "@tanstack/react-router";

import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { useLocalizedStrings } from "@/locales/hooks";

const HomePage: React.FC = () => {
    const ls = useLocalizedStrings();

    useSetPageTitle(ls.$NAVIGATION_HOME);

    return (
        <div>
            <h3>Home</h3>
        </div>
    );
};

export const Route = createFileRoute("/")({
    component: HomePage,
    errorComponent: ErrorPageLazy,
});
