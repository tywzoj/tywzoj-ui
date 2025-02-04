import { makeStyles, mergeClasses } from "@fluentui/react-components";

export interface IProblemEditorProps {
    className?: string;
    onContentChange: (content: string) => void;
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
