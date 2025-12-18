import { createContext, useContext, useEffect, useRef } from "react";

export interface I18nContextValue {
  language: string;
  setLanguage?: (lang: string) => void;
  t: (key: string) => string;

  /** Called automatically when language changes */
  onLanguageChange?: (lang: string) => void | Promise<void>;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: I18nContextValue;
}) => {
  const prevLang = useRef(value.language);

  useEffect(() => {
    if (prevLang.current !== value.language) {
      value.onLanguageChange?.(value.language);
      prevLang.current = value.language;
    }
  }, [value.language, value.onLanguageChange]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}

