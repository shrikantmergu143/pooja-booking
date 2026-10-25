import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import english from '../locales/en/common.json';
import marathi from '../locales/mr/common.json';
import { LANGUAGE_STORAGE_KEY } from '../i18n/constants.ts';

export type LanguageCode = 'en' | 'mr';

const translations = { en: english, mr: marathi } as const;
type TranslationKey = string;
type TranslationParams = Record<string, string | number>;

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: TranslationKey, params?: TranslationParams) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage === 'mr') setLanguageState('mr');
  }, []);

  const setLanguage = (nextLanguage: LanguageCode) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    setLanguageState(nextLanguage);
  };

  useEffect(() => {
    document.documentElement.lang = language === 'mr' ? 'mr' : 'en';
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => {
    const t = (key: TranslationKey, params?: TranslationParams) => {
      const translation = key.split('.').reduce<unknown>((current, segment) => {
        if (!current || typeof current !== 'object') return undefined;
        return (current as Record<string, unknown>)[segment];
      }, translations[language]);
      const template = typeof translation === 'string' ? translation : key;
      return template.replace(/\{\{(\w+)\}\}/g, (_match, name: string) =>
        String(params?.[name] ?? `{{${name}}}`),
      );
    };
    return { language, setLanguage, t };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider.');
  }
  return context;
}
