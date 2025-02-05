import { Radio, RadioGroup } from "@fluentui/react-components";

import { CE_Visibility } from "@/server/common/permission";

import { VisibilityLabel } from "./VisibilityLabel";

export interface IVisibilitySelectorProps {
    visibility: CE_Visibility;
    onChange: (visibility: CE_Visibility) => void;
    disabled?: boolean;
    layout?: "horizontal" | "horizontal-stacked" | "vertical";
}

export const VisibilitySelector: React.FC<IVisibilitySelectorProps> = (props) => {
    const { visibility, onChange, disabled, layout } = props;

    return (
        <RadioGroup
            layout={layout}
            value={String(visibility)}
            onChange={(_, { value }) => onChange(Number(value))}
            disabled={disabled}
        >
            <Radio
                value={String(CE_Visibility.Private)}
                label={<VisibilityLabel visibility={CE_Visibility.Private} />}
            />
            <Radio
                value={String(CE_Visibility.Internal)}
                label={<VisibilityLabel visibility={CE_Visibility.Internal} />}
            />
            <Radio value={String(CE_Visibility.Paid)} label={<VisibilityLabel visibility={CE_Visibility.Paid} />} />
            <Radio value={String(CE_Visibility.Public)} label={<VisibilityLabel visibility={CE_Visibility.Public} />} />
        </RadioGroup>
    );
};
