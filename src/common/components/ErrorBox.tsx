import { Link, makeStyles, MessageBar, MessageBarBody, MessageBarTitle, tokens } from "@fluentui/react-components";
import { ErrorCircle48Filled } from "@fluentui/react-icons";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import type * as React from "react";

import { flex } from "@/common/styles/flex";
import type { IErrorLink } from "@/common/types/error-link";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";

import { LinkWithRouter } from "./LinkWithRouter";

export interface IErrorBoxProps {
    message: string;
    /**
     * A list of links to display on the error page.
     * Users can click on these to navigate to other parts of the app.
     */
    links?: IErrorLink[];
    /**
     * Whether to show a back button to navigate to the previous page.
     * @default false
     */
    showGoBack?: boolean;
}

export const ErrorBox: React.FC<IErrorBoxProps> = (props) => {
    const { message, links = [], showGoBack = false } = props;

    const router = useRouter();
    const canGoBack = useCanGoBack();
    const styles = useStyles();
    const [titleString, backButtonString] = useLocalizedStrings(
        CE_Strings.COMMON_ERROR_TITLE,
        CE_Strings.COMMON_BACK_BUTTON,
    );

    return (
        <div className={styles.root}>
            <MessageBar
                layout="multiline"
                intent="error"
                politeness="polite"
                shape="square"
                icon={<ErrorCircle48Filled />}
            >
                <MessageBarBody>
                    <MessageBarTitle className={styles.title}>{titleString}</MessageBarTitle>
                    {<div className={styles.message}>{message}</div>}
                    <div className={styles.linkContainer}>
                        {links.map((link, index) => (
                            <div key={(link.to || link.href || link.title) + index}>
                                {index > 0 && <div className={styles.linkDivider} />}
                                <LinkWithRouter {...link}>{link.title}</LinkWithRouter>
                            </div>
                        ))}
                        {showGoBack && canGoBack && (
                            <>
                                {links.length > 0 && <div className={styles.linkDivider} />}
                                <Link as="button" onClick={() => router.history.back()}>
                                    {backButtonString}
                                </Link>
                            </>
                        )}
                    </div>
                </MessageBarBody>
            </MessageBar>
        </div>
    );
};

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
    title: {
        fontSize: "16px",
        fontWeight: "bold",
    },
    message: {
        fontSize: "14px",
    },
    linkContainer: {
        marginTop: "4px",
        "&, > div": {
            ...flex({
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                flexWrap: "nowrap",
            }),
            gap: "6px",
        },
    },
    linkDivider: {
        minWidth: "1.5px",
        minHeight: "14px",
        backgroundColor: tokens.colorNeutralForegroundDisabled,
    },
});
