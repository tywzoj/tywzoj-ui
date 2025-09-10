import { ErrorBox } from "@/common/components/ErrorBox";
import { useLocalizedStrings } from "@/locales/hooks";

export const NotFoundPage: React.FC = () => {
    const ls = useLocalizedStrings();
    return <ErrorBox message={ls.$CUSTOM_ERROR_PAGE_NOT_FOUND} />;
};

export default NotFoundPage;
