import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ZH_TW from "./assets/locales/zh-tw/zh-tw.json";
import JA_JP from "./assets/locales/ja/ja-jp.json";

const resources = {
  Taiwan: ZH_TW,
  Japanese: JA_JP,
};

i18n.use(initReactI18next).init({
  resources: resources,
  lng: "Taiwan",
  fallbackLng: "Japanese",
  interpolation: {
    escapeValue: false,
  },
  react: {
    bindI18n: "languageChanged",
  },
});

export default i18n;
