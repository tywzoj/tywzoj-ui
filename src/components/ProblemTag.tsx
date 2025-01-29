import { makeStyles, mergeClasses, shorthands, tokens } from "@fluentui/react-components";

import { flex } from "@/common/styles/flex";
import { isLightColor } from "@/common/utils/color";

export interface IProblemTagProps {
    name: string;
    color: string;
    largeSize?: boolean;
    className?: string;
}

export const ProblemTag = (props: IProblemTagProps) => {
    const styles = useStyles();
    const { name, color, largeSize, className, ...rest } = props;

    const foreground = isLightColor(color)
        ? tokens.colorNeutralForeground1Static
        : tokens.colorNeutralForegroundOnBrand;

    return (
        <div
            className={mergeClasses(styles.root, largeSize && styles.largeSize, className)}
            style={{
                color: foreground,
                backgroundColor: color,
            }}
            {...rest}
        >
            {name}
        </div>
    );
};

const useStyles = makeStyles({
    root: {
        ...flex({
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
        }),
        position: "relative",
        boxSizing: "border-box",
        height: "20px",
        width: "20px",
        minWidth: "max-content",
        fontFamily: tokens.fontFamilyBase,
        fontSize: tokens.fontSizeBase200,
        fontWeight: tokens.fontWeightSemibold,
        lineHeight: tokens.lineHeightBase200,
        padding: `0 calc(${tokens.spacingHorizontalXS} + ${tokens.spacingHorizontalXXS})`,
        borderRadius: tokens.borderRadiusMedium,
        ...shorthands.borderColor(tokens.colorTransparentStroke),
    },
    largeSize: {
        height: "24px",
        width: "24px",
        fontSize: tokens.fontSizeBase300,
        lineHeight: tokens.lineHeightBase300,
    },
});
