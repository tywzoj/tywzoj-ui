import { makeStyles, Title3 } from "@fluentui/react-components";
import { createFileRoute } from "@tanstack/react-router";
import type React from "react";

import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { flex } from "@/common/styles/flex";
import { ProblemEditor } from "@/components/ProblemEditor";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";

const NewProblemPage: React.FC = () => {
    const styles = useStyles();

    const ls = useLocalizedStrings({
        title: CE_Strings.NAVIGATION_PROBLEM_NEW,
    });

    useSetPageTitle(ls.title);

    // TODO: Implement API request
    // TODO: Update styles

    return (
        <div className={styles.root}>
            <div className={styles.title}>
                <Title3 as="h1">{ls.title}</Title3>
            </div>
            <div className={styles.editor}>
                <ProblemEditor
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

export const Route = createFileRoute("/problem/new")({
    component: NewProblemPage,
});
