import { Button, Field, Input, makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

import { LinkWithRouter } from "@/common/components/LinkWithRouter";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/common/constants/data-length";
import { useWithCatchError } from "@/common/hooks/catch-error";
import { useRecaptchaAsync } from "@/common/hooks/recaptcha";
import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { flex } from "@/common/styles/flex";
import { format } from "@/common/utils/format";
import { Z_EMAIL, Z_PASSWORD, Z_USERNAME } from "@/common/validators/user";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { useLocalizedStrings } from "@/locales/hooks";
import { AuthModule } from "@/server/api";
import { CE_ErrorCode } from "@/server/common/error-code";
import { withThrowErrorsExcept } from "@/server/utils";
import { useIsSmallScreen } from "@/store/hooks";

const SignUpPage: React.FC = () => {
    const ls = useLocalizedStrings();
    const styles = useStyles();
    const isSmallScreen = useIsSmallScreen();
    const recaptchaAsync = useRecaptchaAsync();

    useSetPageTitle(ls.$NAVIGATION_SIGN_UP);

    const fieldContainerCls = React.useMemo(
        () => mergeClasses(styles.$fieldContainer, isSmallScreen && styles.$fieldContainerSingle),
        [isSmallScreen, styles],
    );

    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [verificationCode, setVerificationCode] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [pending, setPending] = React.useState(false);
    const [usernameError, setUsernameError] = React.useState("");
    const [emailError, setEmailError] = React.useState("");
    const [verificationCodeError, setVerificationCodeError] = React.useState("");
    const [passwordError, setPasswordError] = React.useState("");
    const [confirmPasswordError, setConfirmPasswordError] = React.useState("");

    const validate = (): boolean => {
        let isValid = true;

        if (!username) {
            setUsernameError(ls.$VALIDATION_ERROR_USERNAME_EMPTY);
            isValid = false;
        }

        if (!Z_USERNAME.safeParse(username).success) {
            setUsernameError(ls.$VALIDATION_ERROR_USERNAME_INVALID);
            isValid = false;
        }

        if (!email) {
            setEmailError(ls.$VALIDATION_ERROR_EMAIL_EMPTY);
            isValid = false;
        }

        if (!Z_EMAIL.safeParse(email).success) {
            setEmailError(ls.$VALIDATION_ERROR_EMAIL_INVALID);
            isValid = false;
        }

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

    const handleSignUpAsync = useWithCatchError(
        React.useCallback(async () => {
            await postSignUpAsync(
                {
                    username,
                    email,
                    emailVerificationCode: verificationCode,
                    password,
                },
                recaptchaAsync,
            );
        }, [email, password, recaptchaAsync, username, verificationCode]),
    );

    const onSubmit = () => {
        if (!validate()) {
            return;
        }

        setPending(true);
        handleSignUpAsync().finally(() => setPending(false));
    };

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
                            disabled={pending}
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
                            <Button disabled={pending || !email}>Send Code</Button>
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

const postSignUpAsync = withThrowErrorsExcept(
    AuthModule.postSignUpAsync,
    CE_ErrorCode.InvalidEmailVerificationCode,
    CE_ErrorCode.Auth_DuplicateUsername,
    CE_ErrorCode.Auth_DuplicateEmail,
);

export const Route = createFileRoute("/sign-up")({
    component: SignUpPage,
    errorComponent: ErrorPageLazy,
});
