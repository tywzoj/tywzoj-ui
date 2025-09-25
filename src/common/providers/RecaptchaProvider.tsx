import "@/assets/styles/recaptcha.css";

import type * as React from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3-safe";

import { stringIdToRecaptchaLanguageMap } from "@/locales/locale";
import { getLocale } from "@/locales/selectors";
import { useAppSelector, useFeature } from "@/store/hooks";

export const RecaptchaProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { recaptchaEnabled, useRecaptchaNet, recaptchaSiteKey } = useFeature();
    const language = useAppSelector(getLocale);

    return recaptchaEnabled ? (
        <GoogleReCaptchaProvider
            reCaptchaKey={recaptchaSiteKey ?? ""}
            useRecaptchaNet={useRecaptchaNet ?? false}
            language={stringIdToRecaptchaLanguageMap[language]}
        >
            {children}
        </GoogleReCaptchaProvider>
    ) : (
        children
    );
};
