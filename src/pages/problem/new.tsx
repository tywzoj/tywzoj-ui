import { makeStyles } from "@fluentui/react-components";
import { createFileRoute } from "@tanstack/react-router";
import type React from "react";

import { flex } from "@/common/styles/flex";
import { ProblemEditor } from "@/components/ProblemEditor";

const NewProblemPage: React.FC = () => {
    // TODO: Implement page
    const styles = useStyles();

    return (
        <div className={styles.root}>
            <div>
                <h1 className={styles.title}>New Problem</h1>
            </div>
            <div className={styles.editor}>
                <ProblemEditor onSaveChanges={() => {}} />
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
