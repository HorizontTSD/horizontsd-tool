import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"
import enTranslations from "./en/common.json"
import ruTranslations from "./ru/common.json"
import itTranslations from "./it/common.json"

i18n.use(initReactI18next)
    .use(LanguageDetector)
    .init({
        fallbackLng: "en",
        defaultNS: "common",
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: { common: enTranslations },
            ru: { common: ruTranslations },
            it: { common: itTranslations },
        },
    })
export default i18n
