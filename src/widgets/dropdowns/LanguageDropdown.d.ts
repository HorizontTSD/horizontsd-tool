export type LanguageCode = "en" | "ru" | "es" | "de" | "fr";

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  flag?: string;
}

export interface LanguageSwitcherProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  className?: string;
}
