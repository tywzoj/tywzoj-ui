import { useGoogleReCaptcha } from "react-google-recaptcha-v3-safe";

import { useFeature } from "@/store/hooks";

import type { CE_RecaptchaAction } from "../enums/recaptcha-action";

export type IRecaptchaAsync = (action: CE_RecaptchaAction) => Promise<string>;

export const useRecaptchaAsync = (): IRecaptchaAsync => {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const { recaptchaEnabled } = useFeature();

    return recaptchaEnabled
        ? async (action) => {
              try {
                  return await executeRecaptcha!(action);
              } catch (e) {
                  console.error("Recaptcha Error:", e);
                  return "";
              }
          }
        : async () => "";
};
