import React from "react";

import { ErrorBox } from "@/common/components/ErrorBox";
import { AppError } from "@/common/exceptions/app-error";
import { useErrorCodeToString, useLocalizedStrings } from "@/locales/hooks";

export interface IErrorPageProps {
    error: unknown;
}

export const ErrorPage: React.FC<IErrorPageProps> = ({ error }) => {
    if (error instanceof AppError) {
        return <AppErrorBox error={error} />;
    } else if (error instanceof Error) {
        return <ErrorBox message={error.message} />;
    } else {
        return <ErrorBox message={String(error)} />;
    }
};

const AppErrorBox: React.FC<{ error: AppError }> = ({ error }) => {
    const errorCodeToString = useErrorCodeToString();
    const ls = useLocalizedStrings();
    const links = React.useMemo(
        () =>
            error.links.map((link) => ({
                ...link,
                title: link.lsFn(ls),
            })),
        [ls, error.links],
    );

    return <ErrorBox message={errorCodeToString(error.code)} links={links} showGoBack={error.showGoBack} />;
};

export default ErrorPage;
