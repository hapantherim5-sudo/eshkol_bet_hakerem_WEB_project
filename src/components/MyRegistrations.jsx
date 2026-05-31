import { useState } from 'react';
import { TYPE_AR } from '../data/fakeData';
import { getOrgName } from '../data/organizations';
import { pick } from '../lib/i18n';

function formatDate(iso, isAr) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(isAr ? 'ar-IL' : 'he-IL', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function MyRegistrations({ lang, currentUser, opportunities, registrations, onOpenModal, onCancel }) {
  const isAr = lang === 'ar';
  const t = (he, ar) => pick(isAr, he, ar);
  const [confirmCancelId, setConfirmCancelId] = useState(null);

  const items = registrations
    .filter(r => r.userId === currentUser.id)
    .map(r => {
      const opp = opportunities.find(o => o.id === r.opportunityId);
      return opp ? { ...opp, registeredAt: r.createdAt } : null;
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));

  const handleCancel = (oppId) => {
    onCancel(oppId);
    setConfirmCancelId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-black text-gray-800">
          {t('הזדמנויות שנרשמתי', 'الفرص التي سجلت فيها')}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {t(
            `${items.length} הזדמנויות פעילות`,
            `${items.length} فرصة نشطة`
          )}
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(o => {
            const title = isAr ? o.titleAr : o.title;
            const typeText = isAr ? (TYPE_AR[o.type] || o.type) : o.type;
            const isConfirming = confirmCancelId === o.id;

            return (
              <div key={o.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-3xl">{o.icon}</span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    {t('רשום', 'مسجل')}
                  </span>
                </div>

                <h3 className="font-bold text-gray-800 text-base mb-1">{title}</h3>
                <p className="text-xs text-gray-500 mb-3">
                  {getOrgName(o.organizationId, isAr)} · {o.city} · {typeText}
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  {t('נרשמת ב-', 'سجلت في ')}{formatDate(o.registeredAt, isAr)}
                </p>

                {isConfirming ? (
                  <div className="mt-auto bg-red-50 rounded-xl p-3 space-y-2">
                    <p className="text-sm text-red-700 font-medium text-center">
                      {t('לבטל את ההרשמה?', 'إلغاء التسجيل؟')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => setConfirmCancelId(null)}
                        className="flex-1 py-2.5 sm:py-2 min-h-[44px] text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-white">
                        {t('לא', 'لا')}
                      </button>
                      <button
                        onClick={() => handleCancel(o.id)}
                        className="flex-1 py-2.5 sm:py-2 min-h-[44px] text-sm bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">
                        {t('כן, בטל', 'نعم، إلغاء')}
                      </button>
                    </div>
                  </div>
                ) : (
                  // Mobile: stack action buttons; sm+: row
                  <div className="mt-auto flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => onOpenModal(o)}
                      className="flex-1 py-2.5 min-h-[44px] text-sm font-bold text-emerald-700 bg-emerald-50
                        rounded-xl hover:bg-emerald-100 transition">
                      {t('פרטים', 'التفاصيل')}
                    </button>
                    <button
                      onClick={() => setConfirmCancelId(o.id)}
                      className="flex-1 py-2.5 min-h-[44px] text-sm font-bold text-red-600 border border-red-200
                        rounded-xl hover:bg-red-50 transition">
                      {t('ביטול הרשמה', 'إلغاء التسجيل')}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-lg font-medium mb-2">
            {t('עדיין לא נרשמת להזדמנויות', 'لم تسجل في أي فرص بعد')}
          </p>
          <p className="text-sm">
            {t('גלוש בלוח ההזדמנויות ובחר פעילות שמעניינת אותך', 'تصفح لوحة الفرص واختر نشاطاً يناسبك')}
          </p>
        </div>
      )}
    </div>
  );
}

export default MyRegistrations;
