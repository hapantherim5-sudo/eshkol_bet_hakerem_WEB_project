import { STATUS_AR } from '../data/fakeData';
import { getOrgName } from '../data/organizations';
import { pick } from '../lib/i18n';

function OpportunityDetailModal({ opportunity, lang, isRegistered, onClose, onRegisterClick, onCancelRegistration }) {
  const isAr = lang === 'ar';
  const o = opportunity;
  const t = (he, ar) => pick(isAr, he, ar);

  const rows = [
    { labelHe: '📍 יישוב', labelAr: '📍 البلدة', val: o.city },
    { labelHe: '🏢 ארגון', labelAr: '🏢 الجهة', val: getOrgName(o.organizationId, isAr) },
    { labelHe: '🎂 גיל', labelAr: '🎂 العمر', val: `${o.ageMin}–${o.ageMax}` },
    { labelHe: '📅 ימים', labelAr: '📅 الأيام', val: isAr && o.daysAr ? o.daysAr : o.days },
    { labelHe: '🕐 שעות', labelAr: '🕐 الوقت', val: o.time },
    { labelHe: '👤 איש קשר', labelAr: '👤 جهة الاتصال', val: o.contact },
    { labelHe: '📝 הרשמה', labelAr: '📝 التسجيل', val: isAr && o.registrationAr ? o.registrationAr : o.registration },
  ];

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div onClick={e => e.stopPropagation()}
        className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full shadow-2xl p-4 sm:p-6 max-h-[90dvh] overflow-y-auto">
        <button onClick={onClose} className="float-left text-gray-400 hover:text-gray-700 text-2xl leading-none min-h-[44px] min-w-[44px]">✕</button>
        <div className="text-center mb-5 clear-both">
          <span className="text-5xl">{o.icon}</span>
          <h2 className="text-xl font-black text-gray-800 mt-2">{isAr ? o.titleAr : o.title}</h2>
          <span className="text-xs text-emerald-700">{isAr ? (STATUS_AR[o.status] || o.status) : o.status}</span>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-5">
          {isAr && o.descriptionAr ? o.descriptionAr : o.description}
        </p>
        {/* Mobile: single column detail rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {rows.map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">{isAr ? item.labelAr : item.labelHe}</p>
              <p className="text-sm font-medium text-gray-800">{item.val}</p>
            </div>
          ))}
        </div>
        {isRegistered ? (
          <div className="space-y-2">
            <p className="w-full py-3 text-center text-emerald-700 font-medium bg-emerald-50 rounded-xl">
              {t('✓ כבר נרשמת לפעילות זו', '✓ مسجل بالفعل في هذا النشاط')}
            </p>
            {onCancelRegistration && (
              <button onClick={onCancelRegistration}
                className="w-full py-3 min-h-[44px] border border-red-300 text-red-600 font-bold rounded-xl
                  hover:bg-red-50 transition">
                {t('ביטול הרשמה', 'إلغاء التسجيل')}
              </button>
            )}
          </div>
        ) : (
          <button onClick={onRegisterClick}
            className="w-full py-3 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition">
            {t('הרשמה לפעילות', 'سجل الآن')}
          </button>
        )}
      </div>
    </div>
  );
}

export default OpportunityDetailModal;
