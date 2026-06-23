import { useState } from 'react';
import { TYPE_AR } from '../data/fakeData';
import { getOrgName } from '../data/organizations';
import { pick } from '../i18n/i18n';

function formatDate(iso, isAr) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(isAr ? 'ar-IL' : 'he-IL', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function MyRegistrationsPage({ lang, currentUser, opportunities, registrations, onOpenModal, onCancel }) {
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
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-800">
          {t('ההרשמות שלי', 'فرصي المسجلة')}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5 font-medium">
          {t(`${items.length} פעילויות פעילות`, `${items.length} نشاط مسجل`)}
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((o, i) => {
            const title = isAr ? o.titleAr : o.title;
            const typeText = isAr ? (TYPE_AR[o.type] || o.type) : o.type;
            const isConfirming = confirmCancelId === o.id;

            return (
              <div key={o.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden
                  flex flex-col hover:shadow-md transition-shadow duration-200 animate-card-in"
                style={{ animationDelay: `${Math.min(i, 6) * 0.05}s` }}>

                {/* Registered badge strip */}
                <div className="h-1.5 bg-emerald-500" />

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-4xl leading-none">{o.icon}</span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full
                      bg-emerald-100 text-emerald-700 flex items-center gap-1">
                      <span>✓</span> {t('רשום', 'مسجل')}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-800 text-base mb-1 leading-snug">{title}</h3>
                  <p className="text-xs text-gray-500 mb-1 font-medium">
                    {getOrgName(o.organizationId, isAr)} · {o.city} · {typeText}
                  </p>
                  <p className="text-xs text-gray-400 mb-4 flex items-center gap-1">
                    <span>🗓️</span>
                    {t('נרשמת: ', 'تاريخ التسجيل: ')}{formatDate(o.registeredAt, isAr)}
                  </p>

                  {isConfirming ? (
                    <div className="mt-auto bg-red-50 border border-red-100 rounded-2xl p-4 space-y-2">
                      <p className="text-sm text-red-700 font-bold text-center">
                        {t('לבטל את ההרשמה?', 'هل تريد إلغاء التسجيل؟')}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setConfirmCancelId(null)}
                          className="flex-1 py-2.5 min-h-[44px] text-sm font-semibold text-gray-600
                            border border-gray-200 rounded-xl hover:bg-white transition">
                          {t('לא', 'لا')}
                        </button>
                        <button
                          onClick={() => handleCancel(o.id)}
                          className="flex-1 py-2.5 min-h-[44px] text-sm font-bold bg-red-600
                            text-white rounded-xl hover:bg-red-700 transition">
                          {t('כן, בטל', 'نعم، إلغاء')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-auto flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => onOpenModal(o)}
                        className="flex-1 py-2.5 min-h-[44px] text-sm font-bold text-emerald-700
                          bg-emerald-50 rounded-xl hover:bg-emerald-100 transition">
                        {t('📋 פרטים', '📋 التفاصيل')}
                      </button>
                      <button
                        onClick={() => setConfirmCancelId(o.id)}
                        className="flex-1 py-2.5 min-h-[44px] text-sm font-bold text-red-600
                          border border-red-200 rounded-xl hover:bg-red-50 transition">
                        {t('ביטול', 'إلغاء')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-6xl mb-5 animate-float inline-block">📋</p>
          <p className="text-xl font-black text-gray-600 mb-2">
            {t('עדיין לא נרשמת', 'لم تسجل في أي نشاط بعد')}
          </p>
          <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto leading-relaxed">
            {t('גלה הזדמנויות מעניינות ובחר את מה שמתאים לך', 'تصفح الفرص المتاحة واختر ما يناسبك')}
          </p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'opportunities' }))}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold
              rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-md text-sm">
            {t('🔍 גלה הזדמנויות', '🔍 استكشف الفرص')}
          </button>
        </div>
      )}
    </div>
  );
}

export default MyRegistrationsPage;
