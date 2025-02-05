import { makeStyles, Title3 } from "@fluentui/react-components";
import { createFileRoute } from "@tanstack/react-router";
import type React from "react";

import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { flex } from "@/common/styles/flex";
import { format } from "@/common/utils/format";
import { ProblemEditor } from "@/components/ProblemEditor";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";
import { CE_QueryId } from "@/query/id";
import { createQueryOptions } from "@/query/utils";
import { ProblemModule } from "@/server/api";
import { withThrowErrors } from "@/server/utils";

const ProblemEditPage: React.FC = () => {
    const problem = Route.useLoaderData();

    const ls = useLocalizedStrings({
        title: CE_Strings.PROBLEM_EDIT_TITLE,
        titleWithId: CE_Strings.PROBLEM_EDIT_TITLE_WITH_ID,
    });

    useSetPageTitle(format(ls.title, problem.displayId, problem.title));

    const styles = useStyles();

    // TODO: Implement API request
    // TODO: Update styles

    return (
        <div className={styles.root}>
            <div className={styles.title}>
                <Title3 as="h1">{format(ls.titleWithId, problem.displayId, problem.id, problem.title)}</Title3>
            </div>
            <div className={styles.editor}>
                <ProblemEditor
                    problem={problem}
                    onSaveChanges={() => {
                        // TODO: API request
                    }}
                />
            </div>
        </div>
    );
};

const useStyles = makeStyles({
    root: {
        ...flex({
            flexDirection: "column",
        }),
        width: "100%",
    },
    title: {
        ...flex({
            justifyContent: "center",
        }),
        width: "100%",
    },
    editor: {},
});
const queryOptions = createQueryOptions(CE_QueryId.ProblemDetail, withThrowErrors(ProblemModule.getProblemDetailAsync));

export const Route = createFileRoute("/problem/$displayId/edit")({
    component: ProblemEditPage,
    loader: async ({ context: { queryClient }, params: { displayId } }) => {
        const { data } = await queryClient.ensureQueryData(
            queryOptions(displayId, {
                queryTags: true,
            }),
        );

        return data;
    },
});
