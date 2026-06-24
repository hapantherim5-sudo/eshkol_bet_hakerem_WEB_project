import he from './he.js';
import ar from './ar.js';

export function useT(lang) {
  const translations = lang === 'ar' ? ar : he;
  return (key) => translations[key] ?? key;
}

export function pick(isAr, he, ar) {
  return isAr ? ar : he;
}

export function setDocumentLang(lang) {
  document.documentElement.lang = lang === 'ar' ? 'ar' : 'he';
}
