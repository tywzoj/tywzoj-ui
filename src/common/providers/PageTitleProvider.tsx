import type * as React from "react";
import { Helmet } from "react-helmet-async";

import { usePageTitle } from "@/store/hooks";

import { SITE_NAME } from "../constants/site-name";

export const PageTitleProvider: React.FC = () => {
    const pageTitle = usePageTitle();

    return (
        <Helmet>
            <title>{pageTitle ? `${pageTitle} - ${SITE_NAME}` : SITE_NAME}</title>
        </Helmet>
    );
};
