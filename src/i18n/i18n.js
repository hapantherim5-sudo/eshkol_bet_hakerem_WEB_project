// File: src/i18n/i18n.js
// Purpose: i18n script
// Role: localization strings and i18n helpers

import he from './he.js';
import ar from './ar.js';

// useT — custom hook for T
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

// setDocumentLang — handles setDocumentLang
export function setDocumentLang(lang) {
  document.documentElement.lang = lang === 'ar' ? 'ar' : 'he';
  document.title = (lang === 'ar' ? ar : he).document_title;
}
