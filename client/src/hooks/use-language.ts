import { useState, useEffect } from 'react';
import type { Language } from '@/lib/i18n';
import { getTranslation } from '@/lib/i18n';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    // Check localStorage first, default to Uzbek
    const stored = localStorage.getItem('texnogrand-language');
    return (stored as Language) || 'uz';
  });

  useEffect(() => {
    localStorage.setItem('texnogrand-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const switchLanguage = (newLang: Language) => {
    setLanguage(newLang);
  };

  const t = (key: string): string => {
    return getTranslation(language, key);
  };

  return {
    language,
    switchLanguage,
    t,
  };
}
