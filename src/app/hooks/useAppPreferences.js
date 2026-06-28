import { useCallback, useEffect, useState } from 'react';
import { setDocumentLang } from '../../i18n/i18n';
import {
  loadCurrentScreen,
  loadTheme,
  saveCurrentScreen,
  saveTheme,
} from '../../utils/storage';

export function useAppPreferences() {
  const [currentScreen, setCurrentScreen] = useState(() => {
    const savedScreen = loadCurrentScreen();
    return savedScreen === 'about' ? 'home' : savedScreen;
  });
  const [theme, setTheme] = useState(() => loadTheme());
  const [lang, setLang] = useState('he');

  useEffect(() => setDocumentLang(lang), [lang]);
  useEffect(() => saveCurrentScreen(currentScreen), [currentScreen]);

  const toggleTheme = useCallback(() => {
    setTheme(previousTheme => {
      const nextTheme = previousTheme === 'dark' ? '' : 'dark';
      saveTheme(nextTheme);
      return nextTheme;
    });
  }, []);

  const toggleLanguage = useCallback(() => {
    setLang(previousLanguage => previousLanguage === 'he' ? 'ar' : 'he');
  }, []);

  return {
    currentScreen,
    setCurrentScreen,
    theme,
    lang,
    toggleTheme,
    toggleLanguage,
  };
}
