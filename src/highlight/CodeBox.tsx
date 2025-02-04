import { Button, makeStyles, tokens, Tooltip } from "@fluentui/react-components";
import { CopyRegular } from "@fluentui/react-icons";
import React from "react";

import { CODE_FONT_FAMILY } from "@/common/constants/font";
import { useDispatchToastError, useDispatchToastSuccess } from "@/common/hooks/toast";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";

import { highlight } from "./highlighter";
import type { ICodeLanguage } from "./types";

export interface ICodeBoxProps {
    readonly code: string;
    readonly lang?: ICodeLanguage | "plaintext";
    readonly showCopy?: boolean;
}

export const CodeBox: React.FC<ICodeBoxProps> = React.memo((props) => {
    const { code, showCopy = true, lang = "plaintext" } = props;
    const styles = useStyles();

    const dispatchToastSuccess = useDispatchToastSuccess();
    const dispatchToastError = useDispatchToastError();

    const ls = useLocalizedStrings({
        copyBtn: CE_Strings.COMMON_COPY_BUTTON,
        successMsg: CE_Strings.CODE_COPIED_MESSAGE,
        errorMsg: CE_Strings.CODE_COPY_FAILED_MESSAGE,
    });

    const allowedToCopy = showCopy && !!window?.navigator?.clipboard?.writeText;

    const onCopyButtonClick = () => {
        window.navigator.clipboard
            .writeText(code)
            .then(() => {
                dispatchToastSuccess(ls.successMsg, "", { timeout: 800 });
            })
            .catch((e) => {
                dispatchToastError(ls.errorMsg, { timeout: 800 });
                console.error(e);
            });
    };

    return (
        <div className={styles.root}>
            <pre className={`language-${lang}`}>
                <code className={`language-${lang}`}>{highlight(code, lang)}</code>
            </pre>
            {allowedToCopy && (
                <Tooltip content={ls.copyBtn} relationship="label">
                    <Button
                        className={styles.copy}
                        size="small"
                        appearance="subtle"
                        onClick={onCopyButtonClick}
                        icon={<CopyRegular />}
                    />
                </Tooltip>
            )}
        </div>
    );
});
CodeBox.displayName = "CodeBox";

const useStyles = makeStyles({
    root: {
        "& pre": {
            overflowX: "auto",
            overflowY: "hidden",
            padding: "0.5em",
            borderRadius: tokens.borderRadiusMedium,
            border: `1px solid ${tokens.colorNeutralStroke2}`,
        },
        "& pre, & code": {
            fontFamily: CODE_FONT_FAMILY,
        },
        position: "relative",
    },
    copy: {
        position: "absolute",
        top: "6px",
        right: "6px",
    },
});

export default CodeBox;
