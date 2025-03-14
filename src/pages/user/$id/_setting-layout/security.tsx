import { Button, Field, Input, makeStyles, mergeClasses } from "@fluentui/react-components";
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

const enum CE_EmailEditStep {
    NotStarted = 0,
    CodeSentToCurrentEmail = 1,
    CodeSentToNewEmail = 2,
}

const EmailEditor: React.FC = () => {
    const { authDetailQueryOptions } = Route.useLoaderData();
    const { data: authDetail } = useSuspenseQueryData(authDetailQueryOptions);
    const styles = useStyles();

    const [step, setStep] = React.useState(CE_EmailEditStep.NotStarted);

    const handleSendCodeToCurrentEmail = () => {
        setStep(CE_EmailEditStep.CodeSentToCurrentEmail);
    };

    const handleSendCodeToNewEmail = () => {
        setStep(CE_EmailEditStep.CodeSentToNewEmail);
    };

    const handleUpdateEmail = () => {
        setStep(CE_EmailEditStep.NotStarted);
    };

    const handleCancel = () => {
        setStep(CE_EmailEditStep.NotStarted);
    };

    return (
        <ContentCard title="Account Email">
            <form className={styles.$form}>
                <Field
                    label="Current Email"
                    hint={
                        "This email will be used for authentication, but it will not be shown to other users in the profile."
                    }
                >
                    <Input type="email" readOnly value={authDetail.email} />
                </Field>
                <Field label="New Email">
                    <Input type="email" readOnly={step != CE_EmailEditStep.NotStarted} />
                </Field>

                {step >= CE_EmailEditStep.CodeSentToCurrentEmail && (
                    <Field label="Verification Code From Current Email">
                        <Input
                            type="text"
                            readOnly={step != CE_EmailEditStep.CodeSentToCurrentEmail}
                            autoComplete="off"
                        />
                    </Field>
                )}

                {step >= CE_EmailEditStep.CodeSentToNewEmail && (
                    <Field label="Verification Code From New Email">
                        <Input type="text" autoComplete="off" />
                    </Field>
                )}

                <div className={styles.$buttonField}>
                    {step === CE_EmailEditStep.NotStarted && (
                        <Button appearance="primary" onClick={handleSendCodeToCurrentEmail}>
                            Send code To Current Email
                        </Button>
                    )}
                    {step === CE_EmailEditStep.CodeSentToCurrentEmail && (
                        <Button appearance="primary" onClick={handleSendCodeToNewEmail}>
                            Send code To New Email
                        </Button>
                    )}
                    {step === CE_EmailEditStep.CodeSentToNewEmail && (
                        <Button appearance="primary" onClick={handleUpdateEmail}>
                            Update Email
                        </Button>
                    )}
                    {step > CE_EmailEditStep.NotStarted && <Button onClick={handleCancel}>Cancel</Button>}
                </div>
            </form>
        </ContentCard>
    );
};
const PasswordEditor: React.FC = () => {
    const styles = useStyles();

    return (
        <ContentCard title="Password">
            <form className={styles.$form}>
                <Field label="Current Password">
                    <Input type="password" autoComplete="current-password" />
                </Field>
                <Field label="New Password">
                    <Input type="password" autoComplete="new-password" />
                </Field>
                <Field label="Confirm New Password">
                    <Input type="password" autoComplete="new-password" />
                </Field>

                <div className={styles.$buttonField}>
                    <Button appearance="primary">Update Password</Button>
                </div>
            </form>
        </ContentCard>
    );
};

const useStyles = makeStyles({
    $root: {
        ...flex({
            flexDirection: "column",
        }),
        width: "100%",
        gap: "24px",
    },
    $form: {
        ...flex({
            flexDirection: "column",
        }),
        width: "100%",
        gap: "8px",
    },
    $buttonField: {
        ...flex(),
        gap: "8px",
        marginTop: "8px",
    },
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
