import { ErrorPage } from "@/components/ErrorPage";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";

export const NotFoundError: React.FC = () => {
    const [message] = useLocalizedStrings(CE_Strings.CUSTOM_ERROR_PAGE_NOT_FOUND);
    return <ErrorPage message={message} />;
};

export default NotFoundError;
