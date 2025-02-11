import { makeStyles, Title3 } from "@fluentui/react-components";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";

import { useWithCatchError } from "@/common/hooks/catch-error";
import { useRecaptchaAsync } from "@/common/hooks/recaptcha";
import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { flex } from "@/common/styles/flex";
import { neverGuard } from "@/common/utils/never-guard";
import type { IProblemEditorChangedData } from "@/components/ProblemEditor";
import { ProblemEditor } from "@/components/ProblemEditor";
import { useErrorCodeToString, useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/locale";
import { problemListQueryKeys } from "@/query/keys";
import { ProblemModule } from "@/server/api";
import { CE_ErrorCode } from "@/server/common/error-code";
import type { IErrorCodeWillBeReturned } from "@/server/utils";
import { withThrowErrorsExcept } from "@/server/utils";

const NewProblemPage: React.FC = () => {
    const errorCodeToString = useErrorCodeToString();
    const recaptchaAsync = useRecaptchaAsync();
    const navigate = Route.useNavigate();
    const queryClient = useQueryClient();

    const ls = useLocalizedStrings({
        title: CE_Strings.NAVIGATION_PROBLEM_NEW,
    });

    const styles = useStyles();

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string>("");

    useSetPageTitle(ls.title);

    // TODO: Implement API request
    // TODO: Update styles

    const handleError = (code: IErrorCodeWillBeReturned<typeof postProblemDetailAsync>) => {
        switch (code) {
            case CE_ErrorCode.Problem_DuplicateDisplayId:
                setError(errorCodeToString(code));
                break;
            default:
                neverGuard(code);
        }
    };

    const handlePostProblemDetailAsync = useWithCatchError(
        async ({ problem, content, samples, tagIds }: IProblemEditorChangedData) => {
            const resp = await postProblemDetailAsync(
                {
                    ...problem,
                    content,
                    samples,
                    tagIds,
                },
                recaptchaAsync,
            );

            if (resp.code === CE_ErrorCode.OK) {
                const { displayId } = resp.data;
                await queryClient.invalidateQueries({ queryKey: problemListQueryKeys() });
                navigate({
                    to: "/problem/$displayId",
                    params: { displayId: displayId.toString(10) },
                });
            } else {
                handleError(resp.code);
            }
        },
    );

    const onSaveChanges = (data: IProblemEditorChangedData) => {
        setLoading(true);
        setError("");
        handlePostProblemDetailAsync(data).finally(() => {
            setLoading(false);
        });
    };

    return (
        <div className={styles.root}>
            <div className={styles.title}>
                <Title3 as="h1">{ls.title}</Title3>
            </div>
            <div className={styles.editor}>
                <ProblemEditor disabled={loading} submitting={loading} error={error} onSaveChanges={onSaveChanges} />
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

const postProblemDetailAsync = withThrowErrorsExcept(
    ProblemModule.postProblemDetailAsync,
    CE_ErrorCode.Problem_DuplicateDisplayId,
);

export const Route = createFileRoute("/problem/new")({
    component: NewProblemPage,
});
