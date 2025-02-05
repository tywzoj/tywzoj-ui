import { makeStyles, mergeClasses } from "@fluentui/react-components";

import type { IProblemContentDetail, IProblemSampleDetail } from "@/server/modules/problem.types";

export interface IProblemEditorProps {
    className?: string;
    onContentChange: (content: IProblemContentDetail) => void;
    onTagsChange: (tags: number[]) => void;
    onSamplesChange: (samples: IProblemSampleDetail[]) => void;
}

export const ProblemEditor: React.FC<IProblemEditorProps> = (props) => {
    const { className } = props;

    const styles = useStyles();

    // TODO: Implement editor

    return <div className={mergeClasses(styles.root, className)}></div>;
};

const useStyles = makeStyles({
    root: {},
});
