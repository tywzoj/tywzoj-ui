import { Badge } from "@fluentui/react-components";

import { useUserLevelColor, useUserLevelString } from "@/common/hooks/user-level";
import type { CE_UserLevel } from "@/server/common/permission";

export interface IUserLevelLabelProps {
    userLevel: CE_UserLevel;
}

export const UserLevelLabel: React.FC<IUserLevelLabelProps> = (props) => {
    const { userLevel } = props;

    const color = useUserLevelColor(userLevel);
    const text = useUserLevelString(userLevel);

    return (
        <Badge appearance="filled" size="large" color={color}>
            {text}
        </Badge>
    );
};
