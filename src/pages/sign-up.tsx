import { Button, Field, Input, makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import * as React from "react";
import { z } from "zod";

import { signInAsyncAction } from "@/common/actions/sign-in";
import { LinkWithRouter } from "@/common/components/LinkWithRouter";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/common/constants/data-length";
import { useWithCatchError } from "@/common/hooks/catch-error";
import { useRecaptchaAsync } from "@/common/hooks/recaptcha";
import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { flex } from "@/common/styles/flex";
import { format } from "@/common/utils/format";
import { neverGuard } from "@/common/utils/never-guard";
import { Z_EMAIL, Z_PASSWORD, Z_USERNAME } from "@/common/validators/user";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { useErrorCodeToString, useLocalizedStrings } from "@/locales/hooks";
import { getLocale } from "@/locales/selectors";
import { AuthModule } from "@/server/api";
import { CE_ErrorCode } from "@/server/common/error-code";
import type { IErrorCodeWillBeReturned } from "@/server/utils";
import { withThrowErrorsExcept } from "@/server/utils";
import { useAppDispatch, useAppSelector, useCurrentUser, useIsSmallScreen } from "@/store/hooks";

const SignUpPage: React.FC = () => {
    const ls = useLocalizedStrings();
    const styles = useStyles();
    const isSmallScreen = useIsSmallScreen();
    const recaptchaAsync = useRecaptchaAsync();
    const errorCodeToString = useErrorCodeToString();
    const dispatch = useAppDispatch();
    const currentUser = useCurrentUser();
    const { redirect } = Route.useSearch();
    const locale = useAppSelector(getLocale);

    useSetPageTitle(ls.$NAVIGATION_SIGN_UP);

    const fieldContainerCls = React.useMemo(
        () => mergeClasses(styles.$fieldContainer, isSmallScreen && styles.$fieldContainerSingle),
        [isSmallScreen, styles],
    );

    const [isSignedIn, setIsSignedIn] = React.useState(!!currentUser);

    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [verificationCode, setVerificationCode] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [usernameError, setUsernameError] = React.useState("");
    const [emailError, setEmailError] = React.useState("");
    const [verificationCodeError, setVerificationCodeError] = React.useState("");
    const [passwordError, setPasswordError] = React.useState("");
    const [confirmPasswordError, setConfirmPasswordError] = React.useState("");

    const [pending, setPending] = React.useState(false);
    const [sendingCode, setSendingCode] = React.useState(false);

    const validateEmail = () => {
        if (!email) {
            setEmailError(ls.$VALIDATION_ERROR_EMAIL_EMPTY);
            return false;
        }

        if (!Z_EMAIL.safeParse(email).success) {
            setEmailError(ls.$VALIDATION_ERROR_EMAIL_INVALID);
            return false;
        }

        return true;
    };

    const validate = () => {
        let isValid = true;

        if (!username) {
            setUsernameError(ls.$VALIDATION_ERROR_USERNAME_EMPTY);
            isValid = false;
        }

        if (!Z_USERNAME.safeParse(username).success) {
            setUsernameError(ls.$VALIDATION_ERROR_USERNAME_INVALID);
            isValid = false;
        }

        isValid = validateEmail() && isValid;

        if (!password) {
            setPasswordError(ls.$VALIDATION_ERROR_PASSWORD_EMPTY);
            isValid = false;
        }

        if (!Z_PASSWORD.safeParse(password).success) {
            setPasswordError(
                format(ls.$VALIDATION_ERROR_PASSWORD_LENGTH_ERROR, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH),
            );
            isValid = false;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError(ls.$VALIDATION_ERROR_PASSWORD_CONFIRM_MISMATCH);
            isValid = false;
        }

        return isValid;
    };

    const handleError = React.useCallback(
        (
            code:
                | IErrorCodeWillBeReturned<typeof postSignUpAsync>
                | IErrorCodeWillBeReturned<typeof postSendSignUpEmailVerificationCodeAsync>,
        ) => {
            switch (code) {
                case CE_ErrorCode.InvalidEmailVerificationCode:
                    setVerificationCodeError(errorCodeToString(code));
                    break;
                case CE_ErrorCode.Auth_DuplicateUsername:
                    setUsernameError(errorCodeToString(code));
                    break;
                case CE_ErrorCode.Auth_DuplicateEmail:
                    setEmailError(errorCodeToString(code));
                    break;
                case CE_ErrorCode.EmailVerificationCodeRateLimited:
                    // TODO: add countdown
                    break;
                default:
                    neverGuard(code);
            }
        },
        [errorCodeToString],
    );

    const handleSendVerificationCode = useWithCatchError(
        React.useCallback(async () => {
            const { code } = await postSendSignUpEmailVerificationCodeAsync({ email, lang: locale }, recaptchaAsync);

            if (code !== CE_ErrorCode.OK) {
                handleError(code);
            }
        }, [email, handleError, recaptchaAsync, locale]),
    );

    const handleSignUpAsync = useWithCatchError(
        React.useCallback(async () => {
            const resp = await postSignUpAsync(
                {
                    username,
                    email,
                    emailVerificationCode: verificationCode,
                    password,
                },
                recaptchaAsync,
            );

            if (resp.code !== CE_ErrorCode.OK) {
                handleError(resp.code);
                return;
            }

            await dispatch(signInAsyncAction(resp.data));
            setIsSignedIn(true);
        }, [dispatch, email, handleError, password, recaptchaAsync, username, verificationCode]),
    );

    const onSendCode = () => {
        if (!validateEmail()) {
            return;
        }

        setSendingCode(true);
        handleSendVerificationCode().finally(() => {
            setSendingCode(false);
        });
    };

    const onSubmit = () => {
        if (!validate()) {
            return;
        }

        setPending(true);
        handleSignUpAsync().finally(() => setPending(false));
    };

    if (isSignedIn) {
        const redirectUrl = new URL(redirect, window.location.href);
        return <Navigate to={redirectUrl.pathname} search={Object.fromEntries(redirectUrl.searchParams.entries())} />;
    }

    return (
        <div className={styles.$root}>
            <h2>{ls.$NAVIGATION_SIGN_UP}</h2>
            <form className={styles.$form}>
                <div className={fieldContainerCls}>
                    <Field
                        label={ls.$USERNAME_LABEL}
                        hint={ls.$USERNAME_HINT}
                        validationMessage={usernameError}
                        className={styles.$field}
                    >
                        <Input
                            type="text"
                            disabled={pending}
                            value={username}
                            onChange={(_, { value }) => {
                                setUsername(value);
                                setUsernameError("");
                            }}
                        />
                    </Field>
                </div>
                <div className={fieldContainerCls}>
                    <Field label={ls.$EMAIL_LABEL} validationMessage={emailError} className={styles.$field}>
                        <Input
                            type="email"
                            disabled={pending || sendingCode}
                            value={email}
                            onChange={(_, { value }) => {
                                setEmail(value);
                                setEmailError("");
                            }}
                        />
                    </Field>
                    <Field
                        label={ls.$VERIFICATION_CODE_LABEL}
                        validationMessage={verificationCodeError}
                        className={styles.$field}
                    >
                        <div className={styles.$codeInputContainer}>
                            <Input
                                type="text"
                                disabled={pending}
                                autoComplete="one-time-code"
                                value={verificationCode}
                                onChange={(_, { value }) => {
                                    setVerificationCode(value);
                                    setVerificationCodeError("");
                                }}
                            />
                            <Button disabled={pending || sendingCode} onClick={onSendCode}>
                                Send Code
                            </Button>
                        </div>
                    </Field>
                </div>
                <div className={fieldContainerCls}>
                    <Field label={ls.$PASSWORD_LABEL} validationMessage={passwordError} className={styles.$field}>
                        <Input
                            type="password"
                            autoComplete="new-password"
                            disabled={pending}
                            value={password}
                            onChange={(_, { value }) => {
                                setPassword(value);
                                setPasswordError("");
                            }}
                        />
                    </Field>
                    <Field
                        label={ls.$PASSWORD_CONFIRM_LABEL}
                        validationMessage={confirmPasswordError}
                        className={styles.$field}
                    >
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
                </div>
                <Button appearance="primary" className={styles.$submitButton} disabled={pending} onClick={onSubmit}>
                    {ls.$COMMON_SUBMIT_BUTTON}
                </Button>
            </form>
            <div className={styles.$signInLinks}>
                <span>Already have an account?</span>
                <LinkWithRouter to="/sign-in">{ls.$NAVIGATION_SIGN_IN}</LinkWithRouter>
            </div>
        </div>
    );
};

const useStyles = makeStyles({
    $root: {
        ...flex({
            flexDirection: "column",
            alignItems: "center",
        }),
        width: "100%",
        maxWidth: "720px",
        boxSizing: "border-box",
        padding: "14px",
        boxShadow: tokens.shadow4Brand,
        borderRadius: tokens.borderRadiusMedium,
    },
    $form: {
        ...flex({
            flexDirection: "column",
            alignItems: "flex-start",
        }),
        gap: "8px",
        width: "100%",
    },
    $fieldContainer: {
        ...flex({
            flexDirection: "row",
            alignItems: "flex-start",
        }),
        gap: "8px 16px",
        width: "100%",
    },
    $fieldContainerSingle: {
        ...flex({
            flexDirection: "column",
        }),
    },
    $field: {
        flex: "1",
    },
    $codeInputContainer: {
        ...flex({
            flexDirection: "row",
        }),
        gap: "8px",
        minWidth: "0",

        "> .fui-Button": {
            minWidth: "0",
        },

        "> .fui-Input": {
            flex: "1",
            minWidth: "0",
        },
    },
    $submitButton: {
        marginTop: "8px",
    },
    $signInLinks: {
        ...flex({
            flexDirection: "row",
        }),
        marginTop: "8px",
        width: "100%",
        gap: "8px",
    },
});

const searchParams = z.object({
    redirect: fallback(z.coerce.string(), "/").default("/"),
});

const postSendSignUpEmailVerificationCodeAsync = withThrowErrorsExcept(
    AuthModule.postSendSignUpEmailVerificationCodeAsync,
    CE_ErrorCode.Auth_DuplicateEmail,
    CE_ErrorCode.EmailVerificationCodeRateLimited,
);

const postSignUpAsync = withThrowErrorsExcept(
    AuthModule.postSignUpAsync,
    CE_ErrorCode.InvalidEmailVerificationCode,
    CE_ErrorCode.Auth_DuplicateUsername,
    CE_ErrorCode.Auth_DuplicateEmail,
);

export const Route = createFileRoute("/sign-up")({
    component: SignUpPage,
    errorComponent: ErrorPageLazy,
    validateSearch: zodValidator(searchParams),
});
