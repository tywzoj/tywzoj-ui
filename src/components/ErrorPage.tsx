import React from "react";

import { ErrorBox } from "@/common/components/ErrorBox";
import { AppError } from "@/common/exceptions/app-error";
import type { IErrorLink, ILocalizedStringFunctionErrorLink } from "@/common/types/error-link";
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

    return (
        <WithLinks links={error.links}>
            {(links) => (
                <ErrorBox message={errorCodeToString(error.code)} links={links} showGoBack={error.showGoBack} />
            )}
        </WithLinks>
    );
};

// Memoize the component because of useLocalizedStrings(...props.links.map((link) => link.string))
// which may cause re-rendering of the component
const WithLinks: React.FC<{
    links: ILocalizedStringFunctionErrorLink[];
    children: (links: IErrorLink[]) => React.ReactNode;
}> = React.memo((props) => {
    const ls = useLocalizedStrings();

    const links = React.useMemo(
        () =>
            props.links.map((link) => ({
                ...link,
                title: link.lsFn(ls),
            })),
        [ls, props.links],
    );

    return props.children(links);
});
WithLinks.displayName = "WithLinks";

export default ErrorPage;
