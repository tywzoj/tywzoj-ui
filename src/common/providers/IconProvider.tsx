import * as React from "react";
import { Helmet } from "react-helmet-async";

import iconDark from "@/assets/icon.dark.png";
import iconLight from "@/assets/icon.light.png";

import { matchMediaDarkTheme } from "../utils/theme-media-query";

export const IconProvider: React.FC = () => {
    const [systemDarkTheme, setSystemDarkTheme] = React.useState<boolean>(matchMediaDarkTheme.matches);

    React.useEffect(() => {
        const callback = (e: MediaQueryListEvent) => {
            setSystemDarkTheme(e.matches);
        };

        matchMediaDarkTheme.addEventListener("change", callback);

        return () => {
            matchMediaDarkTheme.removeEventListener("change", callback);
        };
    }, []);

    const icon = systemDarkTheme ? iconDark : iconLight;

    return (
        <Helmet>
            <link rel="icon" type="image/png" href={icon} />
            <link rel="apple-touch-icon" href={icon} />
        </Helmet>
    );
};
