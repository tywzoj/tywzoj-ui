import type { TooltipProps } from "@fluentui/react-components";
import { Badge, makeStyles, Tooltip } from "@fluentui/react-components";

import { useUserLevelColor, useUserLevelString } from "@/common/hooks/user-level";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/locale";
import type { CE_UserLevel } from "@/server/common/permission";

export interface IUserLevelLabelProps {
    userLevel: CE_UserLevel;
    tooltipPositioning?: TooltipProps["positioning"];
}

export const UserLevelLabel: React.FC<IUserLevelLabelProps> = (props) => {
    const { userLevel, tooltipPositioning } = props;

    const color = useUserLevelColor(userLevel);
    const text = useUserLevelString(userLevel);

    const [label] = useLocalizedStrings(CE_Strings.USER_LEVEL_LABEL);

    const styles = useStyles();

    return (
        <Tooltip content={label} relationship="description" withArrow positioning={tooltipPositioning}>
            <Badge appearance="filled" size="large" color={color} className={styles.badge}>
                {text}
            </Badge>
        </Tooltip>
    );
};

const useStyles = makeStyles({
    badge: {
        // Fix bug on iOS and iPadOS mobile devices
        width: "fit-content",
        whiteSpace: "nowrap",
    },
});
