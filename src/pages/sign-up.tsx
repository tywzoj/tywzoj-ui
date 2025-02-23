import { Button, Field, Input, makeStyles, mergeClasses } from "@fluentui/react-components";
import { createFileRoute } from "@tanstack/react-router";

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

    return (
        <div className={styles.$root}>
            <h2>{ls.$title}</h2>
            <div className={mergeClasses(styles.$cols, isSmallScreen && styles.$colsSingle)}>
                <div className={styles.$field}>
                    <Field label="username">
                        <Input type="text" />
                    </Field>
                </div>
                <div className={styles.$field}></div>
            </div>
            <div className={mergeClasses(styles.$cols, isSmallScreen && styles.$colsSingle)}>
                <div className={styles.$field}>
                    <Field label="email">
                        <Input type="text" />
                    </Field>
                </div>
                <div className={mergeClasses(styles.$field, styles.$codeContainer)}>
                    <Field label="code">
                        <Input type="text" />
                    </Field>
                    <Button>send</Button>
                </div>
            </div>
            <div className={mergeClasses(styles.$cols, isSmallScreen && styles.$colsSingle)}>
                <div className={styles.$field}>
                    <Field label="pass1">
                        <Input type="text" />
                    </Field>
                </div>
                <div className={styles.$field}>
                    <Field label="pass2">
                        <Input type="text" />
                    </Field>
                </div>
            </div>
            <Button appearance="primary" className={styles.$button}>
                Submit
            </Button>
        </div>
    );
};
const useStyles = makeStyles({
    $root: {
        width: "100%",
    },
    $cols: {
        ...flex({
            flexDirection: "row",
        }),
        gap: "18px",
        width: "100%",
    },
    $colsSingle: {
        ...flex({
            flexDirection: "column",
        }),
    },
    $field: {
        flex: "1",
    },
    $codeContainer: {
        ...flex({
            flexDirection: "row",
        }),
        gap: "8px",

        "&> .fui-Button": {
            marginTop: "26px",
        },
        "&> .fui-Field": {
            flex: "1",
        },
    },
    $button: {
        marginTop: "18px",
    },
});
export const Route = createFileRoute("/sign-up")({
    component: SignUpPage,
    errorComponent: ErrorPageLazy,
});
