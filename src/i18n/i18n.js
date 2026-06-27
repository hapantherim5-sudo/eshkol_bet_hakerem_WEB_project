import he from './he.js';
import ar from './ar.js';

export function useT(lang) {
  const translations = lang === 'ar' ? ar : he;
  return (key, variables = {}) => {
    const value = translations[key] ?? key;
    if (typeof value !== 'string') return value;
    return Object.entries(variables).reduce(
      (text, [name, replacement]) => text.split(`{${name}}`).join(String(replacement)),
      value,
    );
  };
}

export function setDocumentLang(lang) {
  document.documentElement.lang = lang === 'ar' ? 'ar' : 'he';
  document.title = (lang === 'ar' ? ar : he).document_title;
}
