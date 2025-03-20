import { Button, Field, Input, makeStyles } from "@fluentui/react-components";
import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import React from "react";

import { EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH } from "@/common/constants/data-length";
import { flex } from "@/common/styles/flex";
import { Z_EMAIL } from "@/common/validators/user";
import { ContentCard } from "@/components/ContentCard";
import { UserLevelSelector } from "@/components/UserLevelSelector";
import { useIsAllowedManageUser } from "@/permission/user/hooks";
import { useSuspenseQueryData } from "@/query/hooks";
import { CE_UserLevel } from "@/server/common/permission";

const LayoutRoute = getRouteApi("/user/$id/_setting-layout");

const UserSecurityPage: React.FC = () => {
    const styles = useStyles();

    return (
        <div className={styles.$root}>
            <EmailEditor />
            <PasswordEditor />
            <UserLevelEditor />
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
    const isAllowedManage = useIsAllowedManageUser(userDetail, false /* allowedManageSelf */);
    const styles = useStyles();

    const [step, setStep] = React.useState(CE_EmailEditStep.NotStarted);
    const [dirty, setDirty] = React.useState(false);
    const [newEmail, setNewEmail] = React.useState("");
    const [currentEmailCode, setCurrentEmailCode] = React.useState("");
    const [newEmailCode, setNewEmailCode] = React.useState("");
    const [pending, setPending] = React.useState(false);
    const [newEmailError, setNewEmailError] = React.useState("");
    const [currentEmailCodeError, setCurrentEmailCodeError] = React.useState("");
    const [newEmailCodeError, setNewEmailCodeError] = React.useState("");

    const resetForm = () => {
        setStep(CE_EmailEditStep.NotStarted);
        setDirty(false);
        setNewEmail("");
        setCurrentEmailCode("");
        setNewEmailCode("");
        setNewEmailError("");
        setCurrentEmailCodeError("");
        setNewEmailCodeError("");
        setPending(false);
    };

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
        resetForm();
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
                <Field label="New Email" validationMessage={newEmailError}>
                    <Input
                        type="email"
                        readOnly={step != CE_EmailEditStep.NotStarted}
                        maxLength={EMAIL_MAX_LENGTH}
                        disabled={pending}
                        value={newEmail}
                        onChange={(_, { value }) => {
                            setNewEmail(value);
                            setDirty(!!value);
                        }}
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
                            Update
                        </Button>
                    )}
                    {dirty && <Button onClick={resetForm}>Reset</Button>}
                </div>
            </form>
        </ContentCard>
    );
};

const PasswordEditor: React.FC = () => {
    const styles = useStyles();

    const [currentPassword, setCurrentPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const dirty = !!(currentPassword || newPassword || confirmPassword);

    const resetForm = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    return (
        <ContentCard title="Password">
            <form className={styles.$form}>
                <Field label="Current Password">
                    <Input
                        type="password"
                        autoComplete="current-password"
                        value={currentPassword}
                        onChange={(_, { value }) => setCurrentPassword(value)}
                    />
                </Field>
                <Field label="New Password">
                    <Input
                        type="password"
                        autoComplete="new-password"
                        maxLength={PASSWORD_MAX_LENGTH}
                        value={newPassword}
                        onChange={(_, { value }) => setNewPassword(value)}
                    />
                </Field>
                <Field label="Confirm New Password">
                    <Input
                        type="password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(_, { value }) => setConfirmPassword(value)}
                    />
                </Field>

                <div className={styles.$buttonField}>
                    <Button appearance="primary">Update</Button>
                    {dirty && <Button onClick={resetForm}>Reset</Button>}
                </div>
            </form>
        </ContentCard>
    );
};

const UserLevelEditor: React.FC = () => {
    const { userDetailQueryOptions } = LayoutRoute.useLoaderData();
    const { data: userDetail } = useSuspenseQueryData(userDetailQueryOptions);
    const isAllowedManage = useIsAllowedManageUser(userDetail, false /* allowedManageSelf */);

    const [level, setLevel] = React.useState(CE_UserLevel.General);
    const [dirty, setDirty] = React.useState(false);

    const styles = useStyles();

    const resetForm = () => {
        setLevel(userDetail.level);
        setDirty(false);
    };

    React.useEffect(() => {
        resetForm();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userDetail.level]);

    if (!isAllowedManage) {
        return null;
    }

    return (
        <ContentCard title="Admin Management">
            <form className={styles.$form}>
                <Field label="Level">
                    <UserLevelSelector
                        level={level}
                        onChange={(level) => {
                            setLevel(level);
                            setDirty(level !== userDetail.level);
                        }}
                    />
                </Field>

                <div className={styles.$buttonField}>
                    <Button appearance="primary">Update</Button>
                    {dirty && (
                        <Button appearance="secondary" onClick={resetForm}>
                            Reset
                        </Button>
                    )}
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
