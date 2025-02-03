import { makeStyles, tokens } from "@fluentui/react-components";

import { CODE_FONT_FAMILY } from "@/common/constants/font";
import { flex } from "@/common/styles/flex";
import { commonLinkStyles } from "@/common/styles/link";

export const useMarkdownRenderStyles = makeStyles({
    placeholder: {
        ...flex({
            flexDirection: "column",
        }),
        gap: "14px",
        width: "100%",
    },
    placeholderLine: {
        ...flex({
            flexDirection: "row",
        }),
        gap: "7px",
        width: "100%",
    },
    root: {
        position: "relative",
        overflow: "hidden",
        transform: "translate3d(0, 0, 0)",
        wordBreak: "break-word",

        "& a": {
            ...commonLinkStyles,
        },

        "& h1, & h2, & h3, & h4, & h5, & h6": {
            margin: "0.5em 0",
        },

        "& h1": { fontSize: tokens.fontSizeHero700 },
        "& h2": { fontSize: tokens.fontSizeBase600 },
        "& h3": { fontSize: tokens.fontSizeBase500 },
        "& h4": { fontSize: tokens.fontSizeBase400 },
        "& h5": { fontSize: tokens.fontSizeBase300 },
        "& h6": { fontSize: tokens.fontSizeBase200 },

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

        "& p, & blockquote": {
            overflowX: "auto",
            overflowY: "hidden",
            margin: "0 0 0.5em",
        },

        "& blockquote": {
            color: tokens.colorNeutralForeground3,
            backgroundColor: tokens.colorNeutralBackground3,
            paddingLeft: "1em",
            borderLeft: `0.25em solid ${tokens.colorNeutralStroke1}`,
            margin: "0 0 1em",
        },

        "& ul, & ol, & blockquote": {
            "&:first-child": {
                marginTop: "0 !important",
            },

            "&:last-child": {
                marginBottom: "0 !important",
            },
        },

        "& p>img:only-child": {
            display: "block",
            margin: "0 auto",
            maxWidth: "100%",
        },

        "> ul, > ol": {
            paddingLeft: "2em",
            "& ul, & ol": {
                paddingLeft: "1.5em",
            },
        },
    },
});
