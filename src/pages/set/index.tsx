import { createFileRoute } from "@tanstack/react-router";

import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";

const ProblemSetListPage: React.FC = () => {
    const ls = useLocalizedStrings({
        title: CE_Strings.NAVIGATION_PROBLEM_SETS,
    });

    useSetPageTitle(ls.title);

    return null;
};

export const Route = createFileRoute("/set/")({
    component: ProblemSetListPage,
});
