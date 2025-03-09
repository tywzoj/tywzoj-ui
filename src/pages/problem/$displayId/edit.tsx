import { makeStyles, Title3 } from "@fluentui/react-components";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";

import { PermissionDeniedError } from "@/common/exceptions/permission-denied";
import { SignInRequiredError } from "@/common/exceptions/sign-in-required";
import { useWithCatchError } from "@/common/hooks/catch-error";
import { useRecaptchaAsync } from "@/common/hooks/recaptcha";
import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { flex } from "@/common/styles/flex";
import { diff } from "@/common/utils/diff";
import { format } from "@/common/utils/format";
import { neverGuard } from "@/common/utils/never-guard";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import type { IProblemEditorChangedData } from "@/components/ProblemEditor";
import { ProblemEditor } from "@/components/ProblemEditor";
import { useErrorCodeToString, useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/locale";
import { checkIsAllowedEditProblem } from "@/permission/problem/checker";
import { useSuspenseQueryData } from "@/query/hooks";
import { CE_QueryId } from "@/query/id";
import { problemDetailQueryKeys, problemListQueryKeys } from "@/query/keys";
import { createQueryOptionsFn } from "@/query/utils";
import { ProblemModule } from "@/server/api";
import { CE_ErrorCode } from "@/server/common/error-code";
import type {
    IProblemContentDetail,
    IProblemContentDetailPatchRequestBody,
    IProblemDetailPatchRequestBody,
} from "@/server/modules/problem.types";
import type { IErrorCodeWillBeReturned } from "@/server/utils";
import { withThrowErrors, withThrowErrorsExcept } from "@/server/utils";

const ProblemEditPage: React.FC = () => {
    const { queryOptions } = Route.useLoaderData();
    const { data: problem } = useSuspenseQueryData(queryOptions);
    const navigate = Route.useNavigate();
    const recaptchaAsync = useRecaptchaAsync();
    const queryClient = useQueryClient();
    const errorCodeToString = useErrorCodeToString();

    const ls = useLocalizedStrings({
        $title: CE_Strings.PROBLEM_EDIT_TITLE,
        $titleWithId: CE_Strings.PROBLEM_EDIT_TITLE_WITH_ID,
    });

    useSetPageTitle(format(ls.$title, problem.displayId, problem.title));

    const styles = useStyles();

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string>("");

    const handleError = (code: IErrorCodeWillBeReturned<typeof patchProblemDetailAsync>) => {
        switch (code) {
            case CE_ErrorCode.Problem_DuplicateDisplayId:
                setError(errorCodeToString(code));
                break;
            default:
                neverGuard(code);
        }
    };

    const handlePatchProblemAsync = useWithCatchError(async (data: IProblemEditorChangedData) => {
        const problemPatchBody: IProblemDetailPatchRequestBody = {};
        const shouldPatchProblem = diff<IProblemDetailPatchRequestBody>(
            {
                ...problem,
                tagIds: problem.tags.map((tag) => tag.id),
            },
            {
                ...data.problem,
                samples: data.samples,
                tagIds: data.tagIds,
            },
            problemPatchBody,
            ["displayId", "title", "visibility", "samples", "tagIds"],
        );

        const problemContentPatchBody: IProblemContentDetailPatchRequestBody = {};
        const shouldPatchContent = diff(
            problem.content ?? ({} as IProblemContentDetail),
            data.content,
            problemContentPatchBody,
            ["description", "inputFormat", "outputFormat", "limitAndHint"],
        );

        if (shouldPatchProblem) {
            const resp = await patchProblemDetailAsync(problem.id, problemPatchBody, recaptchaAsync);
            if (resp.code !== CE_ErrorCode.OK) {
                handleError(resp.code);
                return;
            }
        }

        if (shouldPatchContent) {
            await patchProblemContentDetailAsync(problem.id, problemContentPatchBody, recaptchaAsync);
        }

        const displayId = problem.displayId.toString(10);
        const newDisplayId = problemPatchBody.displayId?.toString(10) ?? displayId;

        await queryClient.invalidateQueries({ queryKey: problemListQueryKeys() });
        await queryClient.invalidateQueries({ queryKey: problemDetailQueryKeys(displayId) });

        navigate({
            to: "/problem/$displayId",
            params: { displayId: newDisplayId },
        });
    });

    const onSaveChanges = (data: IProblemEditorChangedData) => {
        setLoading(true);
        setError("");
        handlePatchProblemAsync(data).finally(() => setLoading(false));
    };

    return (
        <div className={styles.$root}>
            <div className={styles.$title}>
                <Title3 as="h1">{format(ls.$titleWithId, problem.displayId, problem.id, problem.title)}</Title3>
            </div>
            <div className={styles.$editor}>
                <ProblemEditor
                    problem={problem}
                    disabled={loading}
                    submitting={loading}
                    error={error}
                    onSaveChanges={onSaveChanges}
                />
            </div>
        </div>
    );
};

const useStyles = makeStyles({
    $root: {
        ...flex({
            flexDirection: "column",
        }),
        width: "100%",
    },
    $title: {
        ...flex({
            justifyContent: "center",
        }),
        width: "100%",
    },
    $editor: {},
});

const patchProblemDetailAsync = withThrowErrorsExcept(
    ProblemModule.patchProblemDetailAsync,
    CE_ErrorCode.Problem_DuplicateDisplayId,
);
const patchProblemContentDetailAsync = withThrowErrors(ProblemModule.patchProblemContentDetailAsync);

const queryOptionsFn = createQueryOptionsFn(
    CE_QueryId.ProblemDetail,
    withThrowErrors(ProblemModule.getProblemDetailAsync),
);

export const Route = createFileRoute("/problem/$displayId/edit")({
    component: ProblemEditPage,
    errorComponent: ErrorPageLazy,
    beforeLoad: ({ context: { permission, currentUser } }) => {
        if (!currentUser) {
            throw new SignInRequiredError();
        }

        if (!checkIsAllowedEditProblem(permission)) {
            throw new PermissionDeniedError();
        }
    },
    loader: async ({ context: { queryClient }, params: { displayId } }) => {
        const queryOptions = queryOptionsFn(displayId, {
            queryTags: true,
        });

        await queryClient.ensureQueryData(queryOptions);

        return { queryOptions };
    },
});
