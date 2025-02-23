import { Button, Field, Input, makeStyles, mergeClasses } from "@fluentui/react-components";
import { createFileRoute } from "@tanstack/react-router";

import { LinkWithRouter } from "@/common/components/LinkWithRouter";
import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { flex } from "@/common/styles/flex";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/locale";
import { useIsSmallScreen } from "@/store/hooks";

const SignUpPage: React.FC = () => {
    const ls = useLocalizedStrings({
        $title: CE_Strings.NAVIGATION_SIGN_UP,
    });
    const styles = useStyles();
    const isSmallScreen = useIsSmallScreen();

    useSetPageTitle(ls.$title);

    const fieldContainerCls = mergeClasses(styles.$fieldContainer, isSmallScreen && styles.$fieldContainerSingle);

    return (
        <div className={styles.$root}>
            <h2>{ls.$title}</h2>
            <form className={styles.$form}>
                <div className={fieldContainerCls}>
                    <Field label="username" className={styles.$field}>
                        <Input type="text" />
                    </Field>
                    <div className={styles.$field}></div>
                </div>
                <div className={fieldContainerCls}>
                    <Field label="email" className={styles.$field}>
                        <Input type="text" />
                    </Field>
                    <Field label="code" className={styles.$field}>
                        <div className={styles.$codeInputContainer}>
                            <Input type="text" />
                            <Button>send</Button>
                        </div>
                    </Field>
                </div>
                <div className={fieldContainerCls}>
                    <Field label="pass1" className={styles.$field}>
                        <Input type="text" />
                    </Field>
                    <Field label="pass2" className={styles.$field}>
                        <Input type="text" />
                    </Field>
                </div>
                <Button appearance="primary" className={styles.$submitButton}>
                    Submit
                </Button>
            </form>
            <div className={styles.$signInLinks}>
                <span>Already have an account?</span>
                <LinkWithRouter to="/sign-in">Sign in</LinkWithRouter>
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
export const Route = createFileRoute("/sign-up")({
    component: SignUpPage,
    errorComponent: ErrorPageLazy,
});
