import { ErrorBox } from "@/components/ErrorBox";
import { useLocalizedStrings } from "@/locales/hooks";

import { AppError } from "../common/exceptions/app-error";

export interface IErrorPageProps {
    error: Error;
}

export const ErrorPage: React.FC<IErrorPageProps> = ({ error }) => {
    if (error instanceof AppError) {
        return <AppErrorBox error={error} />;
    } else {
        return <ErrorBox message={error.message} />;
    }
};

const AppErrorBox: React.FC<{ error: AppError }> = ({ error }) => {
    const [msg] = useLocalizedStrings(error.getStringId());

    return <ErrorBox message={msg} links={error.links} showGoBack={error.showGoBack} />;
};

export default ErrorPage;
