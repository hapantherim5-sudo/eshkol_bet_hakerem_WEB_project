import { CATEGORIES } from '../data/fakeData';
import { getOrgName } from '../data/organizations';

const CAT_GRADIENT = {
  sport:     'from-orange-400 to-red-500',
  art:       'from-violet-400 to-purple-600',
  volunteer: 'from-emerald-400 to-teal-600',
  science:   'from-blue-400 to-cyan-600',
  community: 'from-pink-400 to-rose-600',
  workshops: 'from-amber-400 to-orange-500',
};

const CAT_BG = {
  sport:     'bg-orange-50 border-orange-100',
  art:       'bg-violet-50 border-violet-100',
  volunteer: 'bg-emerald-50 border-emerald-100',
  science:   'bg-blue-50 border-blue-100',
  community: 'bg-pink-50 border-pink-100',
  workshops: 'bg-amber-50 border-amber-100',
};

const CAT_ACCENT = {
  sport:     'text-orange-600',
  art:       'text-violet-600',
  volunteer: 'text-emerald-600',
  science:   'text-blue-600',
  community: 'text-pink-600',
  workshops: 'text-amber-600',
};

const BADGE_DEFS = [
  { labelHe: '🔥 פופולרי',       labelAr: '🔥 رائج',         bg: 'bg-red-500' },
  { labelHe: '⭐ מומלץ',         labelAr: '⭐ موصى به',      bg: 'bg-amber-500' },
  { labelHe: '🆕 חדש',           labelAr: '🆕 جديد',          bg: 'bg-blue-500' },
  { labelHe: '⏰ נסגר בקרוב',    labelAr: '⏰ ينتهي قريباً', bg: 'bg-rose-500' },
  { labelHe: '👑 מובחר',         labelAr: '👑 مميز',          bg: 'bg-violet-500' },
  { labelHe: '🏆 פרס שנה',       labelAr: '🏆 جائزة العام',  bg: 'bg-emerald-600' },
];

function getBadge(opp, index) {
  if (opp.status === 'מקומות אחרונים') return BADGE_DEFS[3];
  return BADGE_DEFS[index % BADGE_DEFS.length];
}

function getCatLabel(catId, isAr) {
  const cat = CATEGORIES.find(c => c.id === catId);
  if (!cat) return catId;
  return `${cat.icon} ${isAr ? cat.labelAr : cat.label}`;
}

function FeaturedCard({ opp, isAr, onOpenModal }) {
  const title       = isAr ? opp.titleAr       : opp.title;
  const description = isAr && opp.descriptionAr ? opp.descriptionAr : opp.description;
  const orgName     = getOrgName(opp.organizationId, isAr);
  const gradient    = CAT_GRADIENT[opp.category] ?? 'from-emerald-400 to-teal-600';
  const badge       = BADGE_DEFS[0];

  return (
    <div
      onClick={() => onOpenModal(opp)}
      className="relative overflow-hidden rounded-3xl cursor-pointer glow-hot animate-card-in
        hover:-translate-y-1 transition-all duration-300 group">

      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-bl ${gradient} opacity-90`} />

      {/* Decorative circles */}
      <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 animate-blob" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-black/10 animate-blob" style={{ animationDelay: '3s' }} />

      <div className="relative p-7 sm:p-10 text-white">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`inline-flex items-center px-3 py-1 ${badge.bg} rounded-full text-xs font-black shadow-md animate-hot-glow`}>
            {isAr ? badge.labelAr : badge.labelHe}
          </span>
          <span className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-xs font-semibold border border-white/30">
            {getCatLabel(opp.category, isAr)}
          </span>
        </div>

        <div className="flex items-start gap-4 mb-4">
          <span className="text-5xl sm:text-6xl">{opp.icon}</span>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-3xl font-black leading-tight mb-2">{title}</h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed line-clamp-2">{description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          <span className="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-xl text-xs font-semibold">
            🏢 {orgName}
          </span>
          <span className="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-xl text-xs font-semibold">
            📍 {opp.city}
          </span>
          <span className="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-xl text-xs font-semibold">
            🎂 {isAr ? `${opp.ageMin}–${opp.ageMax} سنة` : `גיל ${opp.ageMin}–${opp.ageMax}`}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-2 text-white/90 text-sm font-bold group-hover:text-white transition-colors">
          <span>{isAr ? 'اعرف أكثر' : 'לפרטים נוספים'}</span>
          <span className="group-hover:translate-x-1 transition-transform duration-200 rtl:rotate-180">→</span>
        </div>
      </div>
    </div>
  );
}

function HotCard({ opp, badge, isAr, onOpenModal }) {
  const title   = isAr ? opp.titleAr : opp.title;
  const orgName = getOrgName(opp.organizationId, isAr);
  const bgClass = CAT_BG[opp.category]     ?? 'bg-gray-50 border-gray-100';
  const accentClass = CAT_ACCENT[opp.category] ?? 'text-gray-600';
  const gradient    = CAT_GRADIENT[opp.category] ?? 'from-gray-400 to-gray-600';

  return (
    <div
      onClick={() => onOpenModal(opp)}
      className={`relative overflow-hidden ${bgClass} rounded-2xl border cursor-pointer
        hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 animate-card-in p-5`}>

      {/* Top bar */}
      <div className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-l ${gradient}`} />

      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{opp.icon}</span>
          <span className={`inline-flex items-center px-2.5 py-1 ${badge.bg} text-white text-[10px] font-black rounded-lg`}>
            {isAr ? badge.labelAr : badge.labelHe}
          </span>
        </div>
        <span className={`text-xs font-bold ${accentClass} shrink-0`}>
          {getCatLabel(opp.category, isAr)}
        </span>
      </div>

      <h3 className="font-black text-gray-800 text-sm mb-1 leading-snug">{title}</h3>
      <p className="text-xs text-gray-500 font-medium mb-3">
        🏢 {orgName} · 📍 {opp.city}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs bg-white/70 text-gray-600 px-2 py-0.5 rounded-lg font-medium">
          🎂 {isAr ? `${opp.ageMin}–${opp.ageMax}` : `גיל ${opp.ageMin}–${opp.ageMax}`}
        </span>
        <span className={`text-xs font-bold ${accentClass}`}>
          {isAr ? 'التفاصيل ←' : '← פרטים'}
        </span>
      </div>
    </div>
  );
}

function HotThisWeekPage({ opportunities, lang, onOpenModal }) {
  const isAr = lang === 'ar';

  const open = opportunities.filter(o => o.status === 'פתוח' || o.status === 'מקומות אחרונים');
  const hotOpps = open.length >= 6 ? open.slice(0, 6) : opportunities.slice(0, 6);

  const [featured, ...rest] = hotOpps;

  return (
    <div className="animate-fade-in">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-bl from-red-600 via-orange-500 to-amber-400 text-white">
        <div className="pointer-events-none absolute -top-16 -right-12 w-60 h-60 rounded-full bg-white/5 animate-blob" />
        <div className="pointer-events-none absolute -bottom-10 -left-8 w-44 h-44 rounded-full bg-red-900/20 animate-blob" style={{ animationDelay: '3s' }} />

        <div className="relative max-w-4xl mx-auto px-4 py-12 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold border border-white/30 animate-pulse-gentle">
            <span>🔥</span>
            <span>{isAr ? 'الأكثر رواجاً هذا الأسبوع' : 'הכי חם השבוע'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black mb-3 leading-tight">
            {isAr ? '🔥 الأكثر رواجاً' : '🔥 חם השבוע'}
          </h1>

          <p className="text-orange-100 text-base sm:text-lg max-w-lg mx-auto">
            {isAr
              ? 'الفرص الأكثر طلباً والتي لا تريد أن تفوّتها هذا الأسبوع'
              : 'ההזדמנויות המבוקשות ביותר שלא תרצו לפספס השבוע'}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {hotOpps.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-xl font-bold text-gray-500">
              {isAr ? 'لا توجد فرص متاحة حالياً' : 'אין הזדמנויות זמינות כרגע'}
            </p>
          </div>
        ) : (
          <>
            {/* ── Featured ── */}
            {featured && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">🏆</span>
                  <h2 className="text-lg font-black text-gray-800">
                    {isAr ? 'الأبرز هذا الأسبوع' : 'הבולטת השבוע'}
                  </h2>
                </div>
                <FeaturedCard opp={featured} isAr={isAr} onOpenModal={onOpenModal} />
              </div>
            )}

            {/* ── Hot Grid ── */}
            {rest.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">🔥</span>
                  <h2 className="text-lg font-black text-gray-800">
                    {isAr ? 'أيضاً في القمة' : 'גם בחמישייה הפותחת'}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rest.map((opp, i) => (
                    <HotCard
                      key={opp.id}
                      opp={opp}
                      badge={getBadge(opp, i + 1)}
                      isAr={isAr}
                      onOpenModal={onOpenModal}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── CTA ── */}
            <div className="mt-10 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-l from-orange-50 to-amber-50
                border border-orange-100 rounded-2xl">
                <span className="text-2xl">🎯</span>
                <p className="text-sm font-bold text-gray-700">
                  {isAr
                    ? 'هذه مجرد عينة! اكتشف جميع الفرص في'
                    : 'אלו רק דוגמאות! גלה את כל ההזדמנויות ב'}
                  <span className="text-orange-600 font-black">
                    {isAr ? ' لوح الفرص' : ' לוח ההזדמנויות'}
                  </span>
                </p>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default HotThisWeekPage;
