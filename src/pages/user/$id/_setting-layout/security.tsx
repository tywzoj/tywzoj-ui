import { Button, Field, Input, makeStyles } from "@fluentui/react-components";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import React from "react";

import { EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/common/constants/data-length";
import { useWithCatchError } from "@/common/hooks/catch-error";
import { useRecaptchaAsync } from "@/common/hooks/recaptcha";
import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { flex } from "@/common/styles/flex";
import { format } from "@/common/utils/format";
import { neverGuard } from "@/common/utils/never-guard";
import { Z_EMAIL, Z_PASSWORD } from "@/common/validators/user";
import { ContentCard } from "@/components/ContentCard";
import { UserLevelSelector } from "@/components/UserLevelSelector";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/locale";
import { getLocale } from "@/locales/selectors";
import { useIsAllowedManageUser } from "@/permission/user/hooks";
import { useSuspenseQueryData } from "@/query/hooks";
import { authDetailQueryKeys, userDetailQueryKeys } from "@/query/keys";
import { AuthModule, UserModule } from "@/server/api";
import { CE_ErrorCode } from "@/server/common/error-code";
import type { AuthTypes, UserTypes } from "@/server/types";
import type { IErrorCodeWillBeReturned } from "@/server/utils";
import { withThrowErrors, withThrowErrorsExcept } from "@/server/utils";
import { useAppSelector } from "@/store/hooks";

const LayoutRoute = getRouteApi("/user/$id/_setting-layout");

const UserSecurityPage: React.FC = () => {
    const styles = useStyles();
    const { userDetailQueryOptions } = LayoutRoute.useLoaderData();
    const { data: userDetail } = useSuspenseQueryData(userDetailQueryOptions);
    const isAllowedManage = useIsAllowedManageUser(userDetail, false /* allowedManageSelf */);
    const ls = useLocalizedStrings({
        $title: CE_Strings.USER_SECURITY_PAGE_TITLE,
    });

    useSetPageTitle(ls.$title);

    return (
        <div className={styles.$root}>
            <EmailEditor userDetail={userDetail} isAllowedManage={isAllowedManage} />
            <PasswordEditor userDetail={userDetail} isAllowedManage={isAllowedManage} />
            {isAllowedManage && <AdminManagementEditor userDetail={userDetail} />}
        </div>
    );
};

const enum CE_EmailEditStep {
    NotStarted = 0,
    CodeSentToCurrentEmail = 1,
    CodeSentToNewEmail = 2,
}

const EmailEditor: React.FC<{
    userDetail: UserTypes.IUserDetail;
    isAllowedManage: boolean;
}> = ({ userDetail, isAllowedManage }) => {
    const { authDetailQueryOptions } = LayoutRoute.useLoaderData();
    const { data: authDetail } = useSuspenseQueryData(authDetailQueryOptions);
    const queryClient = useQueryClient();
    const recaptchaAsync = useRecaptchaAsync();
    const locale = useAppSelector(getLocale);
    const styles = useStyles();

    const ls = useLocalizedStrings({
        $title: CE_Strings.AUTH_EMAIL_LABEL,
        $hint: CE_Strings.AUTH_EMAIL_HINT,
        $currentEmailLabel: CE_Strings.CURRENT_EMAIL_LABEL,
        $newEmailLabel: CE_Strings.NEW_EMAIL_LABEL,
        $verificationCodeCurrentEmailLabel: CE_Strings.VERIFICATION_CODE_CURRENT_EMAIL_LABEL,
        $verificationCodeNewEmailLabel: CE_Strings.VERIFICATION_CODE_NEW_EMAIL_LABEL,
        $sendCodeButton: CE_Strings.USER_SECURITY_SEND_EMAIL_RESET_CODE_BUTTON,
        $sendCodeNewEmailButton: CE_Strings.USER_SECURITY_SEND_EMAIL_RESET_CODE_NEW_EMAIL_BUTTON,
        $submitButton: CE_Strings.COMMON_SUBMIT_BUTTON,
        $saveButton: CE_Strings.COMMON_SAVE_BUTTON,
        $resetButton: CE_Strings.COMMON_RESET_BUTTON,
    });

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

    const handleSendCodeToCurrentEmailError = (code: IErrorCodeWillBeReturned<typeof postSendChangeEmailCodeAsync>) => {
        switch (code) {
            case CE_ErrorCode.EmailVerificationCodeRateLimited:
                // TODO: update countdown
                setStep(CE_EmailEditStep.CodeSentToCurrentEmail);
                break;

            default:
                neverGuard(code);
        }
    };

    const handleSendCodeToCurrentEmailAsync = useWithCatchError(
        React.useCallback(async () => {
            const { code } = await postSendChangeEmailCodeAsync(
                {
                    email: newEmail,
                    lang: locale,
                },
                recaptchaAsync,
            );

            if (code !== CE_ErrorCode.OK) {
                handleSendCodeToCurrentEmailError(code);
                return;
            }

            setStep(CE_EmailEditStep.CodeSentToCurrentEmail);
        }, [locale, newEmail, recaptchaAsync]),
    );

    const onSendCodeToCurrentEmail = () => {
        if (!validateNewEmail()) {
            return;
        }

        setPending(true);
        handleSendCodeToCurrentEmailAsync().finally(() => {
            setPending(false);
        });
    };

    const handleSendCodeToNewEmailError = (
        code: IErrorCodeWillBeReturned<typeof postSendNewEmailVerificationCodeAsync>,
    ) => {
        switch (code) {
            case CE_ErrorCode.EmailVerificationCodeRateLimited:
                // TODO: update countdown
                setStep(CE_EmailEditStep.CodeSentToNewEmail);
                break;

            case CE_ErrorCode.InvalidEmailVerificationCode:
                setCurrentEmailCodeError("Invalid verification code from current email");
                break;

            case CE_ErrorCode.Auth_DuplicateEmail:
                setNewEmailError("This email is already in use by another account.");
                break;

            default:
                neverGuard(code);
        }
    };

    const handleSendCodeToNewEmailAsync = useWithCatchError(
        React.useCallback(async () => {
            const { code } = await postSendNewEmailVerificationCodeAsync(
                {
                    email: newEmail,
                    lang: locale,
                    emailVerificationCode: currentEmailCode,
                },
                recaptchaAsync,
            );

            if (code !== CE_ErrorCode.OK) {
                handleSendCodeToNewEmailError(code);
                return;
            }

            setStep(CE_EmailEditStep.CodeSentToNewEmail);
        }, [currentEmailCode, locale, newEmail, recaptchaAsync]),
    );

    const onSendCodeToNewEmail = () => {
        setCurrentEmailCodeError("");

        setPending(true);
        handleSendCodeToNewEmailAsync().finally(() => {
            setPending(false);
        });
    };

    const handleUpdateEmailError = (code: IErrorCodeWillBeReturned<typeof postChangeEmailAsync>) => {
        switch (code) {
            case CE_ErrorCode.InvalidEmailVerificationCode:
                setCurrentEmailCodeError("Invalid verification code from new email.");
                break;

            default:
                neverGuard(code);
        }
    };

    const handleUpdateEmailAsync = useWithCatchError(
        React.useCallback(
            async (editByAdmin: boolean) => {
                const body: AuthTypes.IChangeEmailPostRequestBody = {
                    newEmail,
                };

                if (editByAdmin) {
                    body.userId = userDetail.id;
                } else {
                    body.emailVerificationCode = newEmailCode;
                }

                const { code } = await postChangeEmailAsync(body, recaptchaAsync);

                if (code !== CE_ErrorCode.OK) {
                    handleUpdateEmailError(code);
                    return;
                }

                await queryClient.invalidateQueries({ queryKey: authDetailQueryKeys(userDetail.id.toString()) });

                resetForm();
            },
            [newEmail, newEmailCode, queryClient, recaptchaAsync, userDetail.id],
        ),
    );

    const onUpdateEmail = () => {
        setNewEmailCodeError("");

        setPending(true);
        handleUpdateEmailAsync(false /* editByAdmin */).finally(() => {
            setPending(false);
        });
    };

    const onAdminUpdateEmail = async () => {
        if (!validateNewEmail()) {
            return;
        }

        setPending(true);
        handleUpdateEmailAsync(true /* editByAdmin */).finally(() => {
            setPending(false);
        });
    };

    return (
        <ContentCard title={ls.$title}>
            <form className={styles.$form}>
                <Field label={ls.$currentEmailLabel} hint={ls.$hint}>
                    <Input type="email" readOnly value={authDetail.email} />
                </Field>
                <Field label={ls.$newEmailLabel} validationMessage={newEmailError}>
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
                    <Field label={ls.$verificationCodeCurrentEmailLabel} validationMessage={currentEmailCodeError}>
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
                    <Field label={ls.$verificationCodeNewEmailLabel} validationMessage={newEmailCodeError}>
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
                            {ls.$sendCodeButton}
                        </Button>
                    )}
                    {step === CE_EmailEditStep.CodeSentToCurrentEmail && (
                        <Button appearance="primary" disabledFocusable={pending} onClick={onSendCodeToNewEmail}>
                            {ls.$sendCodeNewEmailButton}
                        </Button>
                    )}
                    {(step === CE_EmailEditStep.CodeSentToNewEmail || isAllowedManage) && (
                        <Button
                            appearance="primary"
                            disabledFocusable={!dirty || pending}
                            onClick={isAllowedManage ? onAdminUpdateEmail : onUpdateEmail}
                        >
                            {isAllowedManage ? ls.$saveButton : ls.$submitButton}
                        </Button>
                    )}
                    {dirty && (
                        <Button disabledFocusable={pending} onClick={resetForm}>
                            {ls.$resetButton}
                        </Button>
                    )}
                </div>
            </form>
        </ContentCard>
    );
};

const PasswordEditor: React.FC<{
    userDetail: UserTypes.IUserDetail;
    isAllowedManage: boolean;
}> = ({ userDetail, isAllowedManage }) => {
    const styles = useStyles();
    const recaptchaAsync = useRecaptchaAsync();
    const ls = useLocalizedStrings({
        $title: CE_Strings.PASSWORD_LABEL,
        $currentPasswordLabel: CE_Strings.CURRENT_PASSWORD_LABEL,
        $newPasswordLabel: CE_Strings.NEW_PASSWORD_LABEL,
        $confirmPasswordLabel: CE_Strings.PASSWORD_CONFIRM_LABEL,
        $passwordEmpty: CE_Strings.VALIDATION_ERROR_PASSWORD_EMPTY,
        $passwordConfirmMismatch: CE_Strings.VALIDATION_ERROR_PASSWORD_CONFIRM_MISMATCH,
        $wrongPassword: CE_Strings.ERROR_2001_WRONG_PASSWORD,
        $passwordLengthError: CE_Strings.VALIDATION_ERROR_PASSWORD_LENGTH_ERROR,
        $saveButton: CE_Strings.COMMON_SAVE_BUTTON,
        $resetButton: CE_Strings.COMMON_RESET_BUTTON,
    });

    const [currentPassword, setCurrentPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [pending, setPending] = React.useState(false);
    const [currentCurrentPasswordError, setCurrentPasswordError] = React.useState("");
    const [newPasswordError, setNewPasswordError] = React.useState("");
    const [confirmPasswordError, setConfirmPasswordError] = React.useState("");

    const dirty = !!(currentPassword || newPassword || confirmPassword);

    const resetForm = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setCurrentPasswordError("");
        setNewPasswordError("");
        setConfirmPasswordError("");
    };

    const handleResetPasswordError = React.useCallback(
        (code: IErrorCodeWillBeReturned<typeof postResetPasswordAsync>) => {
            switch (code) {
                case CE_ErrorCode.Auth_WrongPassword:
                    setCurrentPasswordError(ls.$wrongPassword);
                    break;

                default:
                    neverGuard(code);
            }
        },
        [ls],
    );

    const handleResetPasswordAsync = useWithCatchError(
        React.useCallback(async () => {
            const body: AuthTypes.IResetPasswordPostRequestBody = {
                newPassword,
            };

            if (isAllowedManage) {
                body.userId = userDetail.id;
            } else {
                body.oldPassword = currentPassword;
            }

            const { code } = await postResetPasswordAsync(body, recaptchaAsync);

            if (code !== CE_ErrorCode.OK) {
                handleResetPasswordError(code);
                return;
            }

            resetForm();
        }, [currentPassword, handleResetPasswordError, isAllowedManage, newPassword, recaptchaAsync, userDetail.id]),
    );

    const validateNewPassword = () => {
        if (!currentPassword) {
            setCurrentPasswordError(ls.$passwordEmpty);
            return false;
        }

        if (!newPassword) {
            setNewPasswordError(ls.$passwordEmpty);
            return false;
        }

        if (Z_PASSWORD.safeParse(newPassword).success === false) {
            setNewPasswordError(format(ls.$passwordLengthError, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH));
            return false;
        }

        if (newPassword !== confirmPassword) {
            setConfirmPasswordError(ls.$passwordConfirmMismatch);
            return false;
        }

        return true;
    };

    const onResetPassword = () => {
        if (!validateNewPassword()) {
            return;
        }

        setPending(true);
        handleResetPasswordAsync().finally(() => {
            setPending(false);
        });
    };

    return (
        <ContentCard title={ls.$title}>
            <form className={styles.$form}>
                {!isAllowedManage && (
                    <Field label={ls.$currentPasswordLabel} validationMessage={currentCurrentPasswordError}>
                        <Input
                            type="password"
                            autoComplete="current-password"
                            disabled={pending}
                            value={currentPassword}
                            onChange={(_, { value }) => {
                                setCurrentPassword(value);
                                setCurrentPasswordError("");
                            }}
                        />
                    </Field>
                )}
                <Field label={ls.$newPasswordLabel} validationMessage={newPasswordError}>
                    <Input
                        type="password"
                        autoComplete="new-password"
                        disabled={pending}
                        maxLength={PASSWORD_MAX_LENGTH}
                        value={newPassword}
                        onChange={(_, { value }) => {
                            setNewPassword(value);
                            setNewPasswordError("");
                        }}
                    />
                </Field>
                <Field label={ls.$confirmPasswordLabel} validationMessage={confirmPasswordError}>
                    <Input
                        type="password"
                        autoComplete="new-password"
                        disabled={pending}
                        value={confirmPassword}
                        onChange={(_, { value }) => {
                            setConfirmPassword(value);
                            setConfirmPasswordError("");
                        }}
                    />
                </Field>

                <div className={styles.$buttonField}>
                    <Button appearance="primary" disabledFocusable={!dirty || pending} onClick={onResetPassword}>
                        {ls.$saveButton}
                    </Button>
                    {dirty && (
                        <Button disabledFocusable={pending} onClick={resetForm}>
                            {ls.$resetButton}
                        </Button>
                    )}
                </div>
            </form>
        </ContentCard>
    );
};

const AdminManagementEditor: React.FC<{
    userDetail: UserTypes.IUserDetail;
}> = ({ userDetail }) => {
    const queryClient = useQueryClient();
    const recaptchaAsync = useRecaptchaAsync();
    const ls = useLocalizedStrings({
        $title: CE_Strings.USER_SECURITY_PAGE_ADMIN_MANAGEMENT_TITLE,
        $levelLabel: CE_Strings.USER_LEVEL_LABEL,
        $saveButton: CE_Strings.COMMON_SAVE_BUTTON,
        $resetButton: CE_Strings.COMMON_RESET_BUTTON,
    });

    const [level, setLevel] = React.useState(userDetail.level);
    const [dirty, setDirty] = React.useState(false);
    const [pending, setPending] = React.useState(false);

    const styles = useStyles();

    const resetForm = React.useCallback(() => {
        setLevel(userDetail.level);
        setDirty(false);
    }, [userDetail.level]);

    React.useEffect(() => {
        resetForm();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userDetail.level]);

    const handleUpdateUserLevelAsync = useWithCatchError(
        React.useCallback(async () => {
            const strId = userDetail.id.toString();
            await patchUserDetailAsync(strId, { level }, recaptchaAsync);
            await queryClient.invalidateQueries({ queryKey: userDetailQueryKeys(strId) });
        }, [level, queryClient, recaptchaAsync, userDetail.id]),
    );

    const onUpdateUserLevel = () => {
        setPending(true);
        handleUpdateUserLevelAsync().then(() => {
            setPending(false);
        });
    };

    return (
        <ContentCard title={ls.$title}>
            <form className={styles.$form}>
                <Field label={ls.$levelLabel}>
                    <UserLevelSelector
                        level={level}
                        onChange={(level) => {
                            setLevel(level);
                            setDirty(level !== userDetail.level);
                        }}
                    />
                </Field>

                <div className={styles.$buttonField}>
                    <Button appearance="primary" disabledFocusable={!dirty || pending} onClick={onUpdateUserLevel}>
                        {ls.$saveButton}
                    </Button>
                    {dirty && (
                        <Button appearance="secondary" disabledFocusable={pending} onClick={resetForm}>
                            {ls.$resetButton}
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

const postSendChangeEmailCodeAsync = withThrowErrorsExcept(
    AuthModule.postSendChangeEmailVerificationCodeAsync,
    CE_ErrorCode.EmailVerificationCodeRateLimited,
);

const postSendNewEmailVerificationCodeAsync = withThrowErrorsExcept(
    AuthModule.postSendNewEmailVerificationCodeAsync,
    CE_ErrorCode.EmailVerificationCodeRateLimited,
    CE_ErrorCode.InvalidEmailVerificationCode,
    CE_ErrorCode.Auth_DuplicateEmail,
);

const postChangeEmailAsync = withThrowErrorsExcept(
    AuthModule.postChangeEmailAsync,
    CE_ErrorCode.InvalidEmailVerificationCode,
);

const postResetPasswordAsync = withThrowErrorsExcept(
    AuthModule.postResetPasswordAsync,
    CE_ErrorCode.Auth_WrongPassword,
);

const patchUserDetailAsync = withThrowErrors(UserModule.patchUserDetailAsync);
