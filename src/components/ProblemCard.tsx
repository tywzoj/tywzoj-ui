import { Card, CardHeader, makeStyles, mergeClasses, type Slot, Subtitle1 } from "@fluentui/react-components";

export interface IProblemCardProps {
    className?: string;
    title: string;
    action?: Slot<"div">;
}

export const ProblemCard: React.FC<React.PropsWithChildren<IProblemCardProps>> = (props) => {
    const { className, title, action, children } = props;

    const styles = useStyles();

    return (
        <Card className={mergeClasses(styles.root, className)}>
            <CardHeader
                header={
                    <Subtitle1 as="h2" className={styles.title}>
                        {title}
                    </Subtitle1>
                }
                action={action}
            />
            <div className={styles.content}>{children}</div>
        </Card>
    );
};

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
    title: {
        margin: "unset",
    },
    content: {
        width: "100%",
    },
});
