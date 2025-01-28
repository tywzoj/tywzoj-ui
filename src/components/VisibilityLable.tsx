import { Badge } from "@fluentui/react-components";

import { useVisibilityColor, useVisibilityString } from "@/common/hooks/visibility";
import type { CE_Visibility } from "@/server/common/permission";

export interface IVisibilityLabelProps {
    visibility: CE_Visibility;
}

export const VisibilityLabel: React.FC<IVisibilityLabelProps> = (props) => {
    const { visibility } = props;

    const color = useVisibilityColor(visibility);
    const text = useVisibilityString(visibility);

    return (
        <Badge appearance="filled" color={color}>
            {text}
        </Badge>
    );
};
