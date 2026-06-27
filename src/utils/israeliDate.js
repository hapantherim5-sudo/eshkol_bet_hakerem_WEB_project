// File: src/utils/israeliDate.js
// Purpose: israeliDate script
// Role: utility module for israeliDate

const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

// isoToDisplay — checks whether otodisplay
export function isoToDisplay(iso) {
  const m = ISO_RE.exec(iso || '');
  if (!m) return '';
  return `${m[3]}/${m[2]}/${m[1]}`;
}

// displayToIso — handles displayToIso
export function displayToIso(display) {
  const m = (display || '').trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  const day = +m[1];
  const month = +m[2];
  const year = +m[3];
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const d = new Date(year, month - 1, day);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// maskIsraeliDateInput — handles maskIsraeliDateInput
export function maskIsraeliDateInput(raw) {
  const digits = (raw || '').replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

// formatIsraeliDate — handles formatIsraeliDate
export function formatIsraeliDate(isoOrDate) {
  if (!isoOrDate) return '';
  const iso = typeof isoOrDate === 'string' && ISO_RE.test(isoOrDate)
    ? isoOrDate
    : null;
  if (iso) return isoToDisplay(iso);
  const d = isoOrDate instanceof Date ? isoOrDate : new Date(isoOrDate);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// formatIsraeliDateTime — handles formatIsraeliDateTime
export function formatIsraeliDateTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('he-IL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
}
