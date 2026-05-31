export function pick(isAr, he, ar) {
  return isAr ? ar : he;
}

export function setDocumentLang(lang) {
  document.documentElement.lang = lang === 'ar' ? 'ar' : 'he';
}
