import { Button, makeStyles, mergeClasses, tokens, Tooltip, useArrowNavigationGroup } from "@fluentui/react-components";
import { ChevronLeftFilled, ChevronRightFilled, MoreHorizontalFilled } from "@fluentui/react-icons";
import React from "react";

import { flex } from "@/common/styles/flex";
import { format } from "@/common/utils/format";
import { range } from "@/common/utils/range";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/locale";
import { useIsMiddleScreen, useIsMiniScreen, useIsSmallScreen } from "@/store/hooks";

export interface IPaginationButtonsProps {
    className?: string;
    page: number;
    pageCount: number;
    tiny?: boolean;
    onPageChange: (page: number) => void;
}

export const PaginationButtons: React.FC<IPaginationButtonsProps> = (props) => {
    const { className, page, pageCount, tiny = false, onPageChange } = props;

    const isMiniScreen = useIsMiniScreen();
    const isSmallScreen = useIsSmallScreen();
    const isMiddleScreen = useIsMiddleScreen();

    const ls = useLocalizedStrings({
        preTooltip: CE_Strings.PREVIOUS_PAGE_TOOLTIP,
        nxtTooltip: CE_Strings.NEXT_PAGE_TOOLTIP,
        preLabel: CE_Strings.PREVIOUS_PAGE_ARIA_LABEL,
        nxtLabel: CE_Strings.NEXT_PAGE_ARIA_LABEL,
        fstP: CE_Strings.FIRST_PAGE_BUTTON_ARIA_LABEL,
        lstP: CE_Strings.LAST_PAGE_BUTTON_ARIA_LABEL,
        page: CE_Strings.PAGE_BUTTON_ARIA_LABEL,
    });

    const showPage = pageCount > 1;
    const isFirstPage = page == 1;
    const isLastPage = page == pageCount;

    const styles = useStyles();
    const arrowNavigationAttributes = useArrowNavigationGroup({ axis: "horizontal" });

    const buttonCount = React.useMemo(() => {
        if (isMiniScreen) {
            return 3;
        } else if (isSmallScreen) {
            return 6;
        } else if (isMiddleScreen) {
            return 7;
        } else {
            return 13;
        }
    }, [isMiddleScreen, isMiniScreen, isSmallScreen]);

    const { leftCount, rightCount, omitLeft, omitRight } = React.useMemo(() => {
        let omitLeft = false;
        let omitRight = false;
        let leftCount = page - 2;
        let rightCount = pageCount - page;

        if (leftCount + rightCount > buttonCount + 1) {
            if (leftCount <= Math.floor(buttonCount / 2)) {
                rightCount = buttonCount - leftCount + 1;
                omitRight = true;
            } else if (rightCount <= Math.ceil(buttonCount / 2)) {
                leftCount = buttonCount - rightCount + 1;
                omitLeft = true;
            } else {
                rightCount = Math.floor(buttonCount / 2) + 1;
                leftCount = buttonCount - rightCount;
                omitLeft = omitRight = true;
            }
        }

        return {
            leftCount,
            rightCount,
            omitLeft,
            omitRight,
        };
    }, [buttonCount, page, pageCount]);

    if (!showPage) {
        return null;
    }

    return (
        <div className={mergeClasses(styles.root, className)}>
            <div className={styles.container} {...arrowNavigationAttributes}>
                <Tooltip content={ls.preTooltip} relationship="label">
                    <Button
                        aria-label={ls.preLabel}
                        icon={<ChevronLeftFilled />}
                        shape="square"
                        appearance="transparent"
                        disabled={isFirstPage}
                        onClick={() => onPageChange(page - 1)}
                    />
                </Tooltip>

                {!tiny && (
                    <>
                        <PageButton ariaLabel={ls.fstP} page={1} active={isFirstPage} onClick={() => onPageChange(1)} />

                        {omitLeft && (
                            <Button
                                className={styles.omitButton}
                                icon={<MoreHorizontalFilled />}
                                disabled
                                appearance="transparent"
                            />
                        )}

                        {range(page - leftCount, page + rightCount, 1).map((p) => (
                            <PageButton
                                key={p}
                                ariaLabel={format(ls.page, p)}
                                page={p}
                                active={p == page}
                                onClick={() => onPageChange(p)}
                            />
                        ))}

                        {omitRight && (
                            <Button
                                className={styles.omitButton}
                                icon={<MoreHorizontalFilled />}
                                disabled
                                appearance="transparent"
                            />
                        )}

                        <PageButton
                            ariaLabel={format(ls.lstP, pageCount)}
                            page={pageCount}
                            active={isLastPage}
                            onClick={() => onPageChange(pageCount)}
                        />
                    </>
                )}

                <Tooltip content={ls.nxtTooltip} relationship="label">
                    <Button
                        aria-label={ls.nxtLabel}
                        icon={<ChevronRightFilled />}
                        shape="square"
                        appearance="transparent"
                        disabled={isLastPage}
                        onClick={() => onPageChange(page + 1)}
                    />
                </Tooltip>
            </div>
        </div>
    );
};

interface IPageButtonProps {
    ariaLabel: string;
    page: number;
    active: boolean;
    onClick: () => void;
}

const PageButton: React.FC<IPageButtonProps> = (props) => {
    const { ariaLabel, page, active, onClick } = props;

    const styles = useStyles();

    return (
        <Button
            className={styles.pageButton}
            aria-label={ariaLabel}
            appearance={active ? "primary" : "transparent"}
            onClick={() => !active && onClick()}
            shape="square"
        >
            {page}
        </Button>
    );
};

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
    container: {
        ...flex({
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "nowrap",
        }),
        width: "100%",
        overflow: "visible",
    },
    omitButton: {
        "& svg": {
            color: tokens.colorNeutralForeground1,
        },
    },
    pageButton: {
        minWidth: "unset",
        maxWidth: "38px",
    },
});
