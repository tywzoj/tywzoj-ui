import type { BadgeProps, TooltipProps } from "@fluentui/react-components";
import { Badge, makeStyles, Tooltip } from "@fluentui/react-components";

import { useUserLevelColor, useUserLevelString } from "@/common/hooks/user-level";
import { useLocalizedStrings } from "@/locales/hooks";
import type { CE_UserLevel } from "@/server/common/permission";

export interface IUserLevelLabelProps {
    userLevel: CE_UserLevel;
    showTooltip?: boolean;
    size?: BadgeProps["size"];
    tooltipPositioning?: TooltipProps["positioning"];
}

export const UserLevelLabel: React.FC<IUserLevelLabelProps> = (props) => {
    const { userLevel, showTooltip = true, size = "large", tooltipPositioning } = props;

    const color = useUserLevelColor(userLevel);
    const text = useUserLevelString(userLevel);

    const ls = useLocalizedStrings();

    const styles = useStyles();

    const inner = (
        <Badge appearance="filled" size={size} color={color} className={styles.$badge}>
            {text}
        </Badge>
    );

    return showTooltip ? (
        <Tooltip content={ls.$USER_LEVEL_LABEL} relationship="description" withArrow positioning={tooltipPositioning}>
            {inner}
        </Tooltip>
    ) : (
        inner
    );
};

const useStyles = makeStyles({
    $badge: {
        // Fix bug on iOS and iPadOS mobile devices
        width: "fit-content",
        whiteSpace: "nowrap",
    },
});
