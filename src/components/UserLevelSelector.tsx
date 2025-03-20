import { Dropdown, Option } from "@fluentui/react-components";

import { useUserLevelStringMap } from "@/common/hooks/user-level";
import { CE_UserLevel } from "@/server/common/permission";

import { UserLevelLabel } from "./UserLevelLabel";

export const UserLevelSelector: React.FC<{
    level: CE_UserLevel;
    disabled?: boolean;
    onChange?: (level: CE_UserLevel) => void;
}> = ({ level, disabled, onChange }) => {
    const userLevelStringMap = useUserLevelStringMap();

    const levels = [
        CE_UserLevel.Disabled,
        CE_UserLevel.Specific,
        CE_UserLevel.General,
        CE_UserLevel.Paid,
        CE_UserLevel.Internal,
        CE_UserLevel.Manager,
        CE_UserLevel.Admin,
    ];

    return (
        <Dropdown
            disabled={disabled}
            selectedOptions={[String(level)]}
            value={userLevelStringMap[level]}
            onOptionSelect={(_, data) => onChange?.(Number(data.optionValue))}
        >
            {levels.map((level) => (
                <Option key={`user-level-${level}`} value={String(level)} text={userLevelStringMap[level]}>
                    <UserLevelLabel userLevel={level} showTooltip={false} size="medium" />
                </Option>
            ))}
        </Dropdown>
    );
};
