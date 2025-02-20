import { makeStyles } from "@fluentui/react-components";
import type React from "react";

import { ErrorPage, type IErrorPageProps } from "./ErrorPage";

export const RootErrorPage: React.FC<IErrorPageProps> = ({ error }) => {
    const styles = useStyles();

    return (
        <div className={styles.$root}>
            <ErrorPage error={error} />
        </div>
    );
};

const useStyles = makeStyles({
    $root: {
        padding: "20px",
    },
});

export default RootErrorPage;
