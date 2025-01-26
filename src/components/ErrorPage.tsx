import { Link, makeStyles, MessageBar, MessageBarBody, MessageBarTitle, tokens } from "@fluentui/react-components";
import { ErrorCircle48Filled } from "@fluentui/react-icons";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import type * as React from "react";

import { flex } from "@/common/styles/flex";
import type { NavTo } from "@/common/types/nav-to";
import type { IUrlString } from "@/common/types/url";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";

import { LinkWithRouter } from "./LinkWithRouter";

export type IErrorPageLink =
    | {
          title: string;
          to: NavTo<typeof LinkWithRouter>;
      }
    | {
          title: string;
          href: IUrlString;
      };

export interface IErrorPageProps {
    message: string;
    /**
     * A list of links to display on the error page.
     * Users can click on these to navigate to other parts of the app.
     */
    links?: IErrorPageLink[];
    /**
     * Whether to show a back button to navigate to the previous page.
     * @default false
     */
    showGoBack?: boolean;
}

const useStyles = makeStyles({
    title: {
        fontSize: "16px",
        fontWeight: "bold",
    },
    message: {
        fontSize: "14px",
    },
    linkContainer: {
        ...flex({
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            flexWrap: "wrap",
        }),
        marginTop: "4px",
        gap: "6px",
    },
    linkDivider: {
        minWidth: "1.5px",
        minHeight: "14px",
        backgroundColor: tokens.colorNeutralForegroundDisabled,
    },
});

export const ErrorPage: React.FC<IErrorPageProps> = (props) => {
    const { message, links = [], showGoBack = false } = props;

    const router = useRouter();
    const canGoBack = useCanGoBack();
    const styles = useStyles();
    const [titleString, backButtonString] = useLocalizedStrings(
        CE_Strings.COMMON_ERROR_TITLE,
        CE_Strings.COMMON_BACK_BUTTON,
    );

    return (
        <div>
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
                            <>
                                {index > 0 && <div className={styles.linkDivider} />}
                                {"to" in link ? (
                                    <LinkWithRouter key={link.to + index} to={link.to}>
                                        {link.title}
                                    </LinkWithRouter>
                                ) : (
                                    <Link key={link.href + index} href={link.href} target="_blank">
                                        {link.title}
                                    </Link>
                                )}
                            </>
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
