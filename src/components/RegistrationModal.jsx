import { useState } from 'react';
import { CATEGORIES } from '../data/fakeData';
import { pick } from '../lib/i18n/i18n';

function RegistrationModal({ opportunity, lang, profile, onConfirm, onClose }) {
  const isAr = lang === 'ar';
  const t = (he, ar) => pick(isAr, he, ar);
  const needsProfile = !profile?.settlement;

  const [settlement, setSettlement] = useState(profile?.settlement || '');
  const [interests, setInterests] = useState(profile?.interests || []);

  const toggleInterest = id => {
    setInterests(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleConfirm = () => {
    if (needsProfile && !settlement.trim()) return;
    onConfirm(needsProfile ? { settlement: settlement.trim(), interests } : null);
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-[60] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl max-h-[90dvh] overflow-y-auto">
        <h3 className="text-lg font-black text-gray-800 mb-2">{t('אישור הרשמה', 'تأكيد التسجيل')}</h3>
        <p className="text-sm text-gray-600 mb-4">
          {isAr ? opportunity.titleAr : opportunity.title}
        </p>
        {needsProfile && (
          <div className="space-y-3 mb-4">
            <div>
              <label className="text-xs text-gray-500">{t('יישוב מגורים', 'بلدة السكن')}</label>
              <input value={settlement} onChange={e => setSettlement(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm mt-1" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">{t('תחומי עניין', 'مجالات الاهتمام')}</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => (
                  <button key={c.id} type="button" onClick={() => toggleInterest(c.id)}
                    className={`text-xs px-2 py-1 rounded-md border transition
                      ${interests.includes(c.id) ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-gray-50 border-gray-200'}`}>
                    {c.icon} {isAr ? c.labelAr : c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-2">
          <button onClick={onClose} className="flex-1 py-3 sm:py-2 min-h-[44px] text-sm text-gray-600 border rounded-lg hover:bg-gray-50">
            {t('ביטול', 'إلغاء')}
          </button>
          <button onClick={handleConfirm}
            className="flex-1 py-3 sm:py-2 min-h-[44px] text-sm bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700">
            {t('אשר הרשמה', 'أكد التسجيل')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegistrationModal;
