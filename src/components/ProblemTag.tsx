import { makeStyles, mergeClasses, shorthands, tokens } from "@fluentui/react-components";

import { flex } from "@/common/styles/flex";
import { isLightColor } from "@/common/utils/color";

export interface IProblemTagProps {
    name: string;
    color: string;
    smallSize?: boolean;
    className?: string;
}

export const ProblemTag = (props: IProblemTagProps) => {
    const styles = useStyles();
    const { name, color, smallSize, className, ...rest } = props;

    const foreground = isLightColor(color)
        ? tokens.colorNeutralForeground1Static
        : tokens.colorNeutralForegroundOnBrand;

    return (
        <div
            className={mergeClasses(styles.root, smallSize && styles.smallSize, className)}
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
        height: "24px",
        width: "24px",
        minWidth: "max-content",
        fontFamily: tokens.fontFamilyBase,
        fontSize: tokens.fontSizeBase300,
        fontWeight: tokens.fontWeightSemibold,
        lineHeight: tokens.lineHeightBase300,
        padding: `0 calc(${tokens.spacingHorizontalXS} + ${tokens.spacingHorizontalXXS})`,
        borderRadius: tokens.borderRadiusMedium,
        ...shorthands.borderColor(tokens.colorTransparentStroke),
    },
    smallSize: {
        height: "20px",
        width: "20px",
        fontSize: tokens.fontSizeBase200,
        lineHeight: tokens.lineHeightBase200,
    },
});
