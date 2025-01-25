import { Button, Field, Input, makeStyles, tokens, Tooltip } from "@fluentui/react-components";
import { EyeFilled, EyeOffFilled } from "@fluentui/react-icons";
import { createLazyFileRoute } from "@tanstack/react-router";
import React from "react";

import { flex } from "@/common/styles/flex";
import { LinkWithRouter } from "@/components/LinkWithRouter";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";

const SignInPage: React.FC = () => {
    const ls = useLocalizedStrings({
        showPwd: CE_Strings.SHOW_PASSWORD_LABEL,
        hidePwd: CE_Strings.HIDE_PASSWORD_LABEL,
        username: CE_Strings.USERNAME_OR_EMAIL_LABEL,
        password: CE_Strings.PASSWORD_LABEL,
        title: CE_Strings.NAVIGATION_SIGN_IN,
        signUp: CE_Strings.NAVIGATION_SIGN_UP,
        forgotPwd: CE_Strings.NAVIGATION_FORGOT_PASSWORD,
    });

    const [showPassword, setShowPassword] = React.useState(false);
    const styles = useStyles();

    return (
        <div className={styles.root}>
            <h2>{ls.title}</h2>
            <form className={styles.formContainer}>
                <Field label={ls.username}>
                    <Input type="text" placeholder={ls.username} />
                </Field>
                <Field label={ls.password}>
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={ls.password}
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
                    <Button appearance="primary">{ls.title}</Button>
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

export const Route = createLazyFileRoute("/sign-in")({
    component: SignInPage,
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
