import { Button, Field, Input, makeStyles } from "@fluentui/react-components";
import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import React from "react";

import { EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH } from "@/common/constants/data-length";
import { flex } from "@/common/styles/flex";
import { Z_EMAIL } from "@/common/validators/user";
import { ContentCard } from "@/components/ContentCard";
import { useIsAllowedManageUser } from "@/permission/user/hooks";
import { useSuspenseQueryData } from "@/query/hooks";

const LayoutRoute = getRouteApi("/user/$id/_setting-layout");

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
    const { authDetailQueryOptions, userDetailQueryOptions } = LayoutRoute.useLoaderData();
    const { data: authDetail } = useSuspenseQueryData(authDetailQueryOptions);
    const { data: userDetail } = useSuspenseQueryData(userDetailQueryOptions);
    const isAllowedManage = useIsAllowedManageUser(userDetail) || true;
    const styles = useStyles();

    const [step, setStep] = React.useState(CE_EmailEditStep.NotStarted);
    const [newEmail, setNewEmail] = React.useState("");
    const [currentEmailCode, setCurrentEmailCode] = React.useState("");
    const [newEmailCode, setNewEmailCode] = React.useState("");
    const [pending, setPending] = React.useState(false);
    const [newEmailError, setNewEmailError] = React.useState("");
    const [currentEmailCodeError, setCurrentEmailCodeError] = React.useState("");
    const [newEmailCodeError, setNewEmailCodeError] = React.useState("");

    const validateNewEmail = () => {
        if (!Z_EMAIL.safeParse(newEmail).success) {
            setNewEmailError("Invalid email format");
            return false;
        }

        if (newEmail === authDetail.email) {
            setNewEmailError("New email cannot be the same as current email");
            return false;
        }

        setNewEmailError("");
        return true;
    };

    const handleSendCodeToCurrentEmailAsync = async () => {
        setStep(CE_EmailEditStep.CodeSentToCurrentEmail);
    };

    const onSendCodeToCurrentEmail = () => {
        if (!validateNewEmail()) {
            return;
        }

        setPending(true);
        handleSendCodeToCurrentEmailAsync().finally(() => {
            setPending(false);
        });
    };

    const handleSendCodeToNewEmailAsync = async () => {
        setStep(CE_EmailEditStep.CodeSentToNewEmail);
    };

    const onSendCodeToNewEmail = () => {
        setCurrentEmailCodeError("");

        setPending(true);
        handleSendCodeToNewEmailAsync().finally(() => {
            setPending(false);
        });
    };

    const handleUpdateEmailAsync = async () => {
        setStep(CE_EmailEditStep.NotStarted);
    };

    const onUpdateEmail = () => {
        setNewEmailCodeError("");

        setPending(true);
        handleUpdateEmailAsync().finally(() => {
            setPending(false);
        });
    };

    const onAdminUpdateEmail = async () => {
        if (!validateNewEmail()) {
            return;
        }

        setPending(true);
        handleUpdateEmailAsync().finally(() => {
            setPending(false);
        });
    };

    const onCancel = () => {
        setStep(CE_EmailEditStep.NotStarted);
    };

    return (
        <ContentCard title="Update Account Email">
            <form className={styles.$form}>
                <Field
                    label="Current Email"
                    hint={
                        "This email will be used for authentication, but it will not be shown to other users in the profile."
                    }
                >
                    <Input type="email" readOnly value={authDetail.email} />
                </Field>
                <Field label="New Email" validationMessage={newEmailError}>
                    <Input
                        type="email"
                        readOnly={step != CE_EmailEditStep.NotStarted}
                        maxLength={EMAIL_MAX_LENGTH}
                        disabled={pending}
                        value={newEmail}
                        onChange={(_, { value }) => setNewEmail(value)}
                    />
                </Field>

                {step >= CE_EmailEditStep.CodeSentToCurrentEmail && (
                    <Field label="Verification Code From Current Email" validationMessage={currentEmailCodeError}>
                        <Input
                            type="text"
                            readOnly={step != CE_EmailEditStep.CodeSentToCurrentEmail}
                            autoComplete="off"
                            disabled={pending}
                            value={currentEmailCode}
                            onChange={(_, { value }) => setCurrentEmailCode(value)}
                        />
                    </Field>
                )}

                {step >= CE_EmailEditStep.CodeSentToNewEmail && (
                    <Field label="Verification Code From New Email" validationMessage={newEmailCodeError}>
                        <Input
                            type="text"
                            autoComplete="off"
                            disabled={pending}
                            value={newEmailCode}
                            onChange={(_, { value }) => setNewEmailCode(value)}
                        />
                    </Field>
                )}

                <div className={styles.$buttonField}>
                    {step === CE_EmailEditStep.NotStarted && !isAllowedManage && (
                        <Button appearance="primary" disabledFocusable={pending} onClick={onSendCodeToCurrentEmail}>
                            Send code To Current Email
                        </Button>
                    )}
                    {step === CE_EmailEditStep.CodeSentToCurrentEmail && (
                        <Button appearance="primary" disabledFocusable={pending} onClick={onSendCodeToNewEmail}>
                            Send code To New Email
                        </Button>
                    )}
                    {(step === CE_EmailEditStep.CodeSentToNewEmail || isAllowedManage) && (
                        <Button
                            appearance="primary"
                            disabledFocusable={pending}
                            onClick={isAllowedManage ? onAdminUpdateEmail : onUpdateEmail}
                        >
                            Update Email
                        </Button>
                    )}
                    {step > CE_EmailEditStep.NotStarted && <Button onClick={onCancel}>Cancel</Button>}
                </div>
            </form>
        </ContentCard>
    );
};
const PasswordEditor: React.FC = () => {
    const styles = useStyles();

    return (
        <ContentCard title="Update Password">
            <form className={styles.$form}>
                <Field label="Current Password">
                    <Input type="password" autoComplete="current-password" />
                </Field>
                <Field label="New Password">
                    <Input type="password" autoComplete="new-password" maxLength={PASSWORD_MAX_LENGTH} />
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

export const Route = createFileRoute("/user/$id/_setting-layout/security")({
    component: UserSecurityPage,
});
