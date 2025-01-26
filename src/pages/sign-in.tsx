import { Button, Field, Input, makeStyles, Spinner, tokens, Tooltip } from "@fluentui/react-components";
import { EyeFilled, EyeOffFilled } from "@fluentui/react-icons";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import React from "react";

import { useRecaptchaAsync } from "@/common/hooks/recaptcha";
import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { useDispatchToastError } from "@/common/hooks/toast";
import { flex } from "@/common/styles/flex";
import { setApiToken } from "@/common/utils/token";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { LinkWithRouter } from "@/components/LinkWithRouter";
import { useErrorCodeToString, useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";
import { AuthModule } from "@/server/api";
import { CE_ErrorCode } from "@/server/common/error-code";
import { setAuthAction } from "@/store/actions";
import { useAppDispatch, useCurrentUser } from "@/store/hooks";

export interface ISignInPageSearch {
    redirect?: string;
}

const SignInPage: React.FC = () => {
    const recaptchaAsync = useRecaptchaAsync();
    const dispatch = useAppDispatch();
    const { redirect = "/" } = Route.useSearch();
    const errorCodeToString = useErrorCodeToString();
    const currentUser = useCurrentUser();
    const dispatchToastError = useDispatchToastError();

    const ls = useLocalizedStrings({
        showPwd: CE_Strings.SHOW_PASSWORD_LABEL,
        hidePwd: CE_Strings.HIDE_PASSWORD_LABEL,
        username: CE_Strings.USERNAME_OR_EMAIL_LABEL,
        password: CE_Strings.PASSWORD_LABEL,
        title: CE_Strings.NAVIGATION_SIGN_IN,
        signUp: CE_Strings.NAVIGATION_SIGN_UP,
        forgotPwd: CE_Strings.NAVIGATION_FORGOT_PASSWORD,
        uEmpty: CE_Strings.VALIDATION_ERROR_USERNAME_EMAIL_EMPTY,
        pEmpty: CE_Strings.VALIDATION_ERROR_PASSWORD_EMPTY,
    });

    useSetPageTitle(ls.title);

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
            setUsernameError(ls.uEmpty);
            isValid = false;
        }

        if (!password) {
            setPasswordError(ls.pEmpty);
            isValid = false;
        }

        return isValid;
    };

    const handleError = (code: CE_ErrorCode) => {
        switch (code) {
            case CE_ErrorCode.Auth_NoSuchUser:
                setUsernameError(errorCodeToString(code));
                break;
            case CE_ErrorCode.Auth_WrongPassword:
                setPasswordError(errorCodeToString(code));
                break;
            default:
                dispatchToastError(errorCodeToString(code));
                break;
        }
    };

    const handleSubmit = () => {
        if (!validate()) {
            return;
        }

        setLoading(true);

        AuthModule.postSignInAsync(
            {
                usernameOrEmail: username,
                password,
            },
            recaptchaAsync,
        )
            .then((resp) => {
                if (resp.code === CE_ErrorCode.OK) {
                    dispatch(
                        setAuthAction({
                            token: resp.data.token,
                            user: resp.data.userDetail,
                        }),
                    );
                    setApiToken(resp.data.token);
                } else {
                    handleError(resp.code);
                }
            })
            .catch((err) => {
                dispatchToastError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return currentUser ? (
        <Navigate to={redirect} />
    ) : (
        <div className={styles.root}>
            <h2>{ls.title}</h2>
            <form className={styles.formContainer}>
                <Field label={ls.username} validationMessage={usernameError}>
                    <Input
                        type="text"
                        placeholder={ls.username}
                        value={username}
                        disabled={loading}
                        onChange={(_, { value }) => {
                            setUsername(value);
                            setUsernameError("");
                        }}
                    />
                </Field>
                <Field label={ls.password} validationMessage={passwordError}>
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={ls.password}
                        value={password}
                        onChange={(_, { value }) => {
                            setPassword(value);
                            setPasswordError("");
                        }}
                        disabled={loading}
                        contentAfter={
                            <Tooltip content={showPassword ? ls.hidePwd : ls.showPwd} relationship="label">
                                <Button
                                    appearance="transparent"
                                    icon={showPassword ? <EyeOffFilled /> : <EyeFilled />}
                                    onClick={() => setShowPassword((prev) => !prev)}
                                />
                            </Tooltip>
                        }
                    />
                </Field>
                <div className={styles.signInButton}>
                    <Button
                        appearance="primary"
                        disabledFocusable={loading}
                        icon={loading ? <Spinner size="tiny" /> : null}
                        onClick={handleSubmit}
                    >
                        {ls.title}
                    </Button>
                </div>
            </form>
            <div className={styles.links}>
                <LinkWithRouter to="/sign-up" preload={false}>
                    {ls.signUp}
                </LinkWithRouter>
                <LinkWithRouter to="/forgot-password" preload={false}>
                    {ls.forgotPwd}
                </LinkWithRouter>
            </div>
        </div>
    );
};

export const Route = createFileRoute("/sign-in")({
    component: SignInPage,
    validateSearch: (search): ISignInPageSearch => search,
    errorComponent: ErrorPageLazy,
});

const useStyles = makeStyles({
    root: {
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
    formContainer: {
        ...flex({
            flexDirection: "column",
        }),
        gap: "12px",
        width: "100%",
        boxSizing: "border-box",
    },
    signInButton: {
        marginTop: "8px",
        width: "100%",
        "> button": {
            width: "100%",
        },
    },
    links: {
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
