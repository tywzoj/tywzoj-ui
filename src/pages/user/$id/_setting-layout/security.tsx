import { Button, Field, Input, makeStyles } from "@fluentui/react-components";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";

import { flex } from "@/common/styles/flex";
import { ContentCard } from "@/components/ContentCard";
import { useSuspenseQueryData } from "@/query/hooks";
import { CE_QueryId } from "@/query/id";
import { createQueryOptionsFn } from "@/query/utils";
import { AuthModule } from "@/server/api";
import { withThrowErrors } from "@/server/utils";

const UserSecurityPage: React.FC = () => {
    const styles = useStyles();

    return (
        <div className={styles.$root}>
            <EmailEditor />
            <PasswordEditor />
        </div>
    );
};

const enum CE_EmailEditSteps {
    NotStarted = 0,
    SendCodeToCurrentEmail = 1,
    SendCodeToNewEmail = 2,
}

const EmailEditor: React.FC = () => {
    const { authDetailQueryOptions } = Route.useLoaderData();
    const { data: authDetail } = useSuspenseQueryData(authDetailQueryOptions);
    const styles = useStyles();

    const [step, setStep] = React.useState(CE_EmailEditSteps.NotStarted);

    const handleSendCodeToCurrentEmail = () => {
        setStep(CE_EmailEditSteps.SendCodeToCurrentEmail);
    };

    const handleSendCodeToNewEmail = () => {
        setStep(CE_EmailEditSteps.SendCodeToNewEmail);
    };

    const handleUpdateEmail = () => {
        setStep(CE_EmailEditSteps.NotStarted);
    };

    return (
        <ContentCard title="Account Email">
            <form className={styles.$emailEditor}>
                <Field label="Current Email">
                    <Input type="email" readOnly value={authDetail.email} />
                </Field>
                <Field label="New Email">
                    <Input type="email" readOnly={step != CE_EmailEditSteps.NotStarted} />
                </Field>
                {step === CE_EmailEditSteps.NotStarted && (
                    <div>
                        <Button appearance="primary" onClick={handleSendCodeToCurrentEmail}>
                            Send code To Current Email
                        </Button>
                    </div>
                )}
                {step >= CE_EmailEditSteps.SendCodeToCurrentEmail && (
                    <Field label="Verification Code From Current Email">
                        <Input type="text" readOnly={step != CE_EmailEditSteps.SendCodeToCurrentEmail} />
                    </Field>
                )}
                {step === CE_EmailEditSteps.SendCodeToCurrentEmail && (
                    <div>
                        <Button appearance="primary" onClick={handleSendCodeToNewEmail}>
                            Send code To New Email
                        </Button>
                    </div>
                )}
                {step >= CE_EmailEditSteps.SendCodeToNewEmail && (
                    <>
                        <Field label="Verification Code From New Email">
                            <Input type="text" />
                        </Field>
                        <div>
                            <Button appearance="primary" onClick={handleUpdateEmail}>
                                {" "}
                                Update Email
                            </Button>
                        </div>
                    </>
                )}
            </form>
        </ContentCard>
    );
};
const PasswordEditor: React.FC = () => {
    return <ContentCard title="Password"></ContentCard>;
};

const useStyles = makeStyles({
    $root: {
        ...flex({
            flexDirection: "column",
        }),
        width: "100%",
        gap: "16px",
    },
    $emailEditor: {
        ...flex({
            flexDirection: "column",
        }),
        width: "100%",
        gap: "16px",
    },
    $buttonField: {},
});

const authDetailQueryOptionsFn = createQueryOptionsFn(
    CE_QueryId.AuthDetail,
    withThrowErrors(AuthModule.getAuthDetailAsync),
);

export const Route = createFileRoute("/user/$id/_setting-layout/security")({
    component: UserSecurityPage,
    loader: async ({ context: { queryClient }, params: { id } }) => {
        const authDetailQueryOptions = authDetailQueryOptionsFn(id);

        await queryClient.ensureQueryData(authDetailQueryOptions);

        return { authDetailQueryOptions };
    },
});
