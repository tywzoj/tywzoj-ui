import {
    Card,
    CardHeader,
    makeStyles,
    mergeClasses,
    type Slot,
    Subtitle1,
    Subtitle2,
} from "@fluentui/react-components";

export interface IContentCardProps {
    className?: string;
    title?: string;
    small?: boolean;
    action?: Slot<"div">;
}

export const ContentCard: React.FC<React.PropsWithChildren<IContentCardProps>> = (props) => {
    const { className, title, small = false, action, children } = props;
    const showHeader = title || action;

    const styles = useStyles();

    return (
        <Card className={mergeClasses(styles.root, className)}>
            {showHeader && (
                <CardHeader
                    header={
                        small ? (
                            <Subtitle2 as="h2" className={styles.title}>
                                {title}
                            </Subtitle2>
                        ) : (
                            <Subtitle1 as="h2" className={styles.title}>
                                {title}
                            </Subtitle1>
                        )
                    }
                    action={action}
                />
            )}
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
