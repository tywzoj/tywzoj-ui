import { createFileRoute } from "@tanstack/react-router";

import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/locale";

const HomePage: React.FC = () => {
    const ls = useLocalizedStrings({
        title: CE_Strings.NAVIGATION_HOME,
    });

    useSetPageTitle(ls.title);

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
