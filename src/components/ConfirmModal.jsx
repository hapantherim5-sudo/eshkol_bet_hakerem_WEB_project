import { pick } from '../lib/i18n/i18n';

function ConfirmModal({
  lang,
  titleHe,
  titleAr,
  messageHe,
  messageAr,
  confirmHe,
  confirmAr,
  onConfirm,
  onClose,
  danger = false,
}) {
  const isAr = lang === 'ar';
  const t = (he, ar) => pick(isAr, he, ar);

  return (
    <div onClick={onClose} className="fixed inset-0 z-[60] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl">
        <h3 className="text-lg font-black text-gray-800 mb-2">{t(titleHe, titleAr)}</h3>
        <p className="text-sm text-gray-600 mb-4">{t(messageHe, messageAr)}</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button onClick={onClose} className="flex-1 py-3 sm:py-2 min-h-[44px] text-sm text-gray-600 border rounded-lg hover:bg-gray-50">
            {t('ביטול', 'إلغاء')}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 sm:py-2 min-h-[44px] text-sm text-white font-bold rounded-lg transition
              ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
            {t(confirmHe, confirmAr)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
