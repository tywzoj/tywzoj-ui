import { Button, Field, Input, makeStyles, Spinner, ToggleButton, tokens, Tooltip } from "@fluentui/react-components";
import { EyeFilled, EyeOffFilled } from "@fluentui/react-icons";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import React from "react";
import { z } from "zod";

import { signInAsyncAction } from "@/common/actions/sign-in";
import { LinkWithRouter } from "@/common/components/LinkWithRouter";
import { useWithCatchError } from "@/common/hooks/catch-error";
import { useRecaptchaAsync } from "@/common/hooks/recaptcha";
import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { flex } from "@/common/styles/flex";
import { neverGuard } from "@/common/utils/never-guard";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { useErrorCodeToString, useLocalizedStrings } from "@/locales/hooks";
import { AuthModule } from "@/server/api";
import { CE_ErrorCode } from "@/server/common/error-code";
import type { IErrorCodeWillBeReturned } from "@/server/utils";
import { withThrowErrorsExcept } from "@/server/utils";
import { useAppDispatch, useCurrentUser } from "@/store/hooks";

const SignInPage: React.FC = () => {
    const recaptchaAsync = useRecaptchaAsync();
    const dispatch = useAppDispatch();
    const { redirect } = Route.useSearch();
    const errorCodeToString = useErrorCodeToString();
    const currentUser = useCurrentUser();
    const [loginSucceed, setLoginSucceed] = React.useState(!!currentUser);

    const passwordRef = React.useRef<HTMLInputElement>(null);

    const ls = useLocalizedStrings();

    useSetPageTitle(ls.$NAVIGATION_SIGN_IN);

    const styles = useStyles();

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [usernameError, setUsernameError] = React.useState("");
    const [passwordError, setPasswordError] = React.useState("");

    const validate = () => {
        let isValid = true;

        if (!username) {
            setUsernameError(ls.$VALIDATION_ERROR_USERNAME_EMAIL_EMPTY);
            isValid = false;
        }

        if (!password) {
            setPasswordError(ls.$VALIDATION_ERROR_PASSWORD_EMPTY);
            isValid = false;
        }

        return isValid;
    };

    const handleError = React.useCallback(
        (code: IErrorCodeWillBeReturned<typeof signInRequestAsync>) => {
            switch (code) {
                case CE_ErrorCode.Auth_NoSuchUser:
                    setUsernameError(errorCodeToString(code));
                    break;
                case CE_ErrorCode.Auth_WrongPassword:
                    setPasswordError(errorCodeToString(code));
                    break;
                default:
                    neverGuard(code);
            }
        },
        [errorCodeToString],
    );

    const handleSignInAsync = useWithCatchError(async (usernameOrEmail: string, password: string) => {
        const resp = await signInRequestAsync({ usernameOrEmail, password }, recaptchaAsync);

        if (resp.code !== CE_ErrorCode.OK) {
            handleError(resp.code);
            return;
        }

        await dispatch(signInAsyncAction(resp.data));
        setLoginSucceed(true);
    });

    const handleSubmit = () => {
        if (!validate()) {
            return;
        }

        setLoading(true);
        handleSignInAsync(username, password).finally(() => {
            setLoading(false);
        });
    };

    if (loginSucceed) {
        const redirectUrl = new URL(redirect, window.location.href);
        return <Navigate to={redirectUrl.pathname} search={Object.fromEntries(redirectUrl.searchParams.entries())} />;
    }

    return (
        <div className={styles.$root}>
            <h2>{ls.$NAVIGATION_SIGN_IN}</h2>
            <form className={styles.$formContainer}>
                <Field label={ls.$USERNAME_OR_EMAIL_LABEL} validationMessage={usernameError}>
                    <Input
                        type="text"
                        placeholder={ls.$USERNAME_OR_EMAIL_LABEL}
                        value={username}
                        disabled={loading}
                        onChange={(_, { value }) => {
                            setUsername(value);
                            setUsernameError("");
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                passwordRef.current?.focus();
                            }
                        }}
                    />
                </Field>
                <Field label={ls.$PASSWORD_LABEL} validationMessage={passwordError}>
                    <Input
                        ref={passwordRef}
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder={ls.$PASSWORD_LABEL}
                        value={password}
                        onChange={(_, { value }) => {
                            setPassword(value);
                            setPasswordError("");
                        }}
                        onKeyDown={(e) => {
                            if (!loading && e.key === "Enter") {
                                handleSubmit();
                            }
                        }}
                        disabled={loading}
                        contentAfter={
                            <Tooltip
                                content={showPassword ? ls.$HIDE_PASSWORD_LABEL : ls.$SHOW_PASSWORD_LABEL}
                                relationship="label"
                            >
                                <ToggleButton
                                    checked={showPassword}
                                    appearance="transparent"
                                    icon={showPassword ? <EyeFilled /> : <EyeOffFilled />}
                                    onClick={() => setShowPassword((prev) => !prev)}
                                />
                            </Tooltip>
                        }
                    />
                </Field>
                <div className={styles.$signInButton}>
                    <Button
                        appearance="primary"
                        disabledFocusable={loading}
                        icon={loading ? <Spinner size="tiny" /> : null}
                        onClick={handleSubmit}
                    >
                        {ls.$NAVIGATION_SIGN_IN}
                    </Button>
                </div>
            </form>
            <div className={styles.$links}>
                <LinkWithRouter to="/sign-up" preload={false}>
                    {ls.$NAVIGATION_SIGN_UP}
                </LinkWithRouter>
                <LinkWithRouter to="/forgot-password" preload={false}>
                    {ls.$NAVIGATION_FORGOT_PASSWORD}
                </LinkWithRouter>
            </div>
        </div>
    );
};

const useStyles = makeStyles({
    $root: {
        ...flex({
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        }),
        width: "100%",
        maxWidth: "450px",
        boxSizing: "border-box",
        padding: "14px",
        boxShadow: tokens.shadow4Brand,
        borderRadius: tokens.borderRadiusMedium,
    },
    $formContainer: {
        ...flex({
            flexDirection: "column",
        }),
        gap: "12px",
        width: "100%",
        boxSizing: "border-box",
    },
    $signInButton: {
        marginTop: "8px",
        width: "100%",
        "> button": {
            width: "100%",
        },
    },
    $links: {
        ...flex({
            flexDirection: "row",
            justifyContent: "center",
        }),
        width: "100%",
        gap: "24px",
        marginTop: "16px",
        boxSizing: "border-box",
    },
});

const searchParams = z.object({
    redirect: fallback(z.coerce.string(), "/").default("/"),
});

const signInRequestAsync = withThrowErrorsExcept(
    AuthModule.postSignInAsync,
    CE_ErrorCode.Auth_NoSuchUser,
    CE_ErrorCode.Auth_WrongPassword,
);

export const Route = createFileRoute("/sign-in")({
    component: SignInPage,
    validateSearch: zodValidator(searchParams),
    errorComponent: ErrorPageLazy,
});
