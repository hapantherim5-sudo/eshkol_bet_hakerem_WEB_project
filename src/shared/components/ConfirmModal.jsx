// File: src/components/ConfirmModal.jsx
// Purpose: ConfirmModal component
// Role: React component for ConfirmModal

import { useT } from '../../i18n/i18n';

// ConfirmModal — renders ConfirmModal
function ConfirmModal({
  lang,
  title,
  message,
  confirmLabel,
  onConfirm,
  onClose,
  danger = false,
  busy = false,
}) {
  const t = useT(lang);

  return (
    <div
      onClick={busy ? undefined : onClose}
      className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl border border-gray-100 bg-white p-5 shadow-2xl animate-scale-in sm:rounded-3xl sm:p-7">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${danger ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
          {danger ? (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <span className="text-xl" aria-hidden="true">✓</span>
          )}
        </div>
        <h3 id="confirm-modal-title" className="mb-2 text-xl font-black text-gray-800">{title}</h3>
        <p id="confirm-modal-message" className="mb-6 text-sm leading-6 text-gray-600">{message}</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button disabled={busy} onClick={onClose} className="min-h-[44px] flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:py-2.5">
            {t('cancel')}
          </button>
          <button
            disabled={busy}
            onClick={onConfirm}
            className={`min-h-[44px] flex-1 rounded-xl py-3 text-sm font-black text-white shadow-lg transition disabled:cursor-wait disabled:opacity-70 sm:py-2.5
              ${danger ? 'bg-red-600 shadow-red-600/20 hover:bg-red-700' : 'bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700'}`}>
            {busy ? t('loading') : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
