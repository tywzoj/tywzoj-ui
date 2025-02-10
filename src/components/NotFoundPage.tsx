import { ErrorBox } from "@/common/components/ErrorBox";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/locale";

export const NotFoundPage: React.FC = () => {
    const [message] = useLocalizedStrings(CE_Strings.CUSTOM_ERROR_PAGE_NOT_FOUND);
    return <ErrorBox message={message} />;
};

export default NotFoundPage;
