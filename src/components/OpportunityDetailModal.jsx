import { STATUS_AR } from '../data/fakeData';
import { getOrgName } from '../data/organizations';
import { pick } from '../i18n/i18n';

const CAT_HEADER = {
  sport:     'from-orange-400 to-amber-500',
  art:       'from-violet-500 to-purple-600',
  volunteer: 'from-emerald-500 to-teal-600',
  science:   'from-blue-500   to-cyan-600',
  community: 'from-pink-500   to-rose-600',
  workshops: 'from-amber-400  to-yellow-500',
};

function OpportunityDetailModal({ opportunity, lang, isRegistered, onClose, onRegisterClick, onCancelRegistration }) {
  const isAr = lang === 'ar';
  const o = opportunity;
  const t = (he, ar) => pick(isAr, he, ar);

  const headerGradient = CAT_HEADER[o.category] ?? 'from-emerald-500 to-teal-600';
  const statusText = isAr ? (STATUS_AR[o.status] || o.status) : o.status;

  const rows = [
    { icon: '📍', labelHe: 'יישוב',     labelAr: 'البلدة',        val: o.city },
    { icon: '🏢', labelHe: 'ארגון',     labelAr: 'الجهة',         val: getOrgName(o.organizationId, isAr) },
    { icon: '🎂', labelHe: 'גיל',       labelAr: 'العمر',         val: `${o.ageMin}–${o.ageMax}` },
    { icon: '📅', labelHe: 'ימים',      labelAr: 'الأيام',        val: isAr && o.daysAr ? o.daysAr : o.days },
    { icon: '🕐', labelHe: 'שעות',      labelAr: 'الوقت',         val: o.time },
    { icon: '👤', labelHe: 'איש קשר',   labelAr: 'جهة الاتصال',  val: o.contact },
    { icon: '📝', labelHe: 'הרשמה',     labelAr: 'التسجيل',       val: isAr && o.registrationAr ? o.registrationAr : o.registration },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full shadow-2xl
          max-h-[92dvh] overflow-y-auto animate-slide-up">

        {/* Colored header */}
        <div className={`relative bg-gradient-to-br ${headerGradient} text-white px-5 pt-8 pb-6 rounded-t-3xl sm:rounded-t-3xl`}>
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center
              bg-white/20 hover:bg-white/30 rounded-full text-white text-lg transition-all
              hover:scale-110 active:scale-95">
            ✕
          </button>

          <div className="text-center">
            <span className="text-6xl leading-none block mb-3 drop-shadow-sm">{o.icon}</span>
            <h2 className="text-xl font-black mb-2 leading-snug drop-shadow-sm">
              {isAr ? o.titleAr : o.title}
            </h2>
            <span className="inline-block px-3 py-1 bg-white/25 rounded-full text-xs font-semibold backdrop-blur-sm">
              {statusText}
            </span>
          </div>
        </div>

        <div className="p-5">
          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-5 bg-gray-50 rounded-2xl p-4">
            {isAr && o.descriptionAr ? o.descriptionAr : o.description}
          </p>

          {/* Info rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
            {rows.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                <span className="text-lg leading-none mt-0.5">{item.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-medium mb-0.5">
                    {isAr ? item.labelAr : item.labelHe}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 break-words">{item.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          {isRegistered ? (
            <div className="space-y-2.5">
              <div className="w-full py-3.5 text-center font-semibold bg-emerald-50 text-emerald-700
                rounded-2xl border border-emerald-200 flex items-center justify-center gap-2">
                <span className="text-base">✓</span>
                {t('נרשמת לפעילות זו', 'مسجل في هذا النشاط')}
              </div>
              {onCancelRegistration && (
                <button
                  onClick={onCancelRegistration}
                  className="w-full py-3.5 min-h-[44px] border border-red-200 text-red-600 font-bold
                    rounded-2xl hover:bg-red-50 transition-all duration-150 active:scale-95">
                  {t('ביטול הרשמה', 'إلغاء التسجيل')}
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onRegisterClick}
              className="w-full py-3.5 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white
                font-black rounded-2xl transition-all duration-150 hover:scale-[1.02] active:scale-95
                shadow-lg shadow-emerald-100 text-base">
              {t('הרשמה לפעילות ←', 'سجّل الآن ←')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OpportunityDetailModal;
