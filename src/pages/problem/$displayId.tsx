import { Switch } from "@fluentui/react-components";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import type React from "react";

import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { CE_QueryId } from "@/query/id";
import { createQueryOptions } from "@/query/utils";
import { ProblemModule } from "@/server/api";
import { withThrowErrors } from "@/server/utils";
import { setPreferenceAction } from "@/store/actions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getPreference } from "@/store/selectors";

const ProblemDetailPage: React.FC = () => {
    const problem = Route.useLoaderData();
    const { showTagsOnProblemDetail } = useAppSelector(getPreference);
    const dispatch = useAppDispatch();
    const router = useRouter();

    useSetPageTitle(`#${problem.displayId}.${problem.title}`);

    return (
        <div>
            <div>
                <Switch
                    label="Show Tags"
                    checked={showTagsOnProblemDetail}
                    onChange={(_, { checked }) => {
                        dispatch(setPreferenceAction({ showTagsOnProblemDetail: checked }));
                        router.invalidate();
                    }}
                />
            </div>
        </div>
    );
};

const queryOptions = createQueryOptions(CE_QueryId.ProblemDetail, withThrowErrors(ProblemModule.getProblemDetailAsync));

export const Route = createFileRoute("/problem/$displayId")({
    component: ProblemDetailPage,
    errorComponent: ErrorPageLazy,
    loader: async ({ context: { queryClient, store }, params: { displayId } }) => {
        const { showTagsOnProblemDetail } = getPreference(store.getState());

        const { data } = await queryClient.ensureQueryData(
            queryOptions(displayId, {
                queryTags: showTagsOnProblemDetail,
            }),
        );

        return data;
    },
});
