import { createFileRoute } from "@tanstack/react-router";

import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { useLocalizedStrings } from "@/locales/hooks";

const ProblemSetListPage: React.FC = () => {
    const ls = useLocalizedStrings();

    useSetPageTitle(ls.$NAVIGATION_PROBLEM_SETS);

    return null;
};

export const Route = createFileRoute("/set/")({
    component: ProblemSetListPage,
});
