import type { BadgeProps } from "@fluentui/react-components";
import { Badge, makeStyles } from "@fluentui/react-components";

import { useVisibilityColor, useVisibilityString } from "@/common/hooks/visibility";
import type { CE_Visibility } from "@/server/common/permission";

export interface IVisibilityLabelProps {
    visibility: CE_Visibility;
    size?: BadgeProps["size"];
}

export const VisibilityLabel: React.FC<IVisibilityLabelProps> = (props) => {
    const { visibility, size } = props;

    const color = useVisibilityColor(visibility);
    const text = useVisibilityString(visibility);

    const styles = useStyles();

    return (
        <Badge appearance="filled" color={color} size={size} className={styles.badge}>
            {text}
        </Badge>
    );
};

const useStyles = makeStyles({
    badge: {
        // Fix bug on iOS and iPadOS mobile devices
        width: "fit-content",
        whiteSpace: "nowrap",
    },
});
