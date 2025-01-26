import { ErrorPage } from "@/components/ErrorPage";
import { useLocalizedStrings } from "@/locales/hooks";

import { AppError } from "../exceptions";

export interface IErrorBoxProps {
    error: Error;
}

export const ErrorBox: React.FC<IErrorBoxProps> = ({ error }) => {
    if (error instanceof AppError) {
        return <AppErrorBox error={error} />;
    } else {
        return <ErrorPage message={error.message} />;
    }
};

const AppErrorBox: React.FC<{ error: AppError }> = ({ error }) => {
    const [msg] = useLocalizedStrings(error.getStringId());

    return <ErrorPage message={msg} links={error.links} showGoBack={error.showGoBack} />;
};
