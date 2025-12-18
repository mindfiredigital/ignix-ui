import { createContext, useContext } from "react";

export interface I18nContextValue {
  language: string;
  setLanguage?: (lang: string) => void;
  t: (key: string) => string;

  // 🔥 EXTENSION POINT
  onLanguageChange?: (lang: string) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: I18nContextValue;
}) => {
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};
