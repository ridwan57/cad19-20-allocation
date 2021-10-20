import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en/translationEN.json";
import translationBN from "./locales/bn/translationBN.json";

// translation
const resources = {
    en: {
        translation: translationEN
    },
    bn: {
        translation: translationBN 
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'bn',

        keySeparator: false,

        interPolation: {
            escapeValue: false
        }
    });

export default i18n;

// npm i i18next
// npm i react-i18next