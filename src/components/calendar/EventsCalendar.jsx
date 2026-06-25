import { useState } from 'react';
import { getMonthGrid, dateKey } from '../../utils/calendar';
import { getOrgName, getCityName } from '../../data/organizations';
import { pick } from '../../i18n/i18n';
import { formatIsraeliDate } from '../../utils/israeliDate';

const WEEK_HE = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
const WEEK_AR = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];

const FEW_THRESHOLD = 3;

function EventsCalendar({ lang, opportunities, onOpenOpp, onNavigate, currentUser, registrations }) {
  const isAr = lang === 'ar';
  const t    = (he, ar) => pick(isAr, he, ar);
  const now  = new Date();

  const [year,        setYear       ] = useState(now.getFullYear());
  const [month,       setMonth      ] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState(now.getDate());

  /* ── Registered opportunities for the current user ── */
  const registeredIds = new Set(
    (registrations ?? [])
      .filter(r => r.userId === currentUser?.id)
      .map(r => r.opportunityId),
  );

  const userOpps = (opportunities ?? []).filter(
    o => registeredIds.has(o.id) && o.eventDate,
  );

  const today      = dateKey(now.getFullYear(), now.getMonth(), now.getDate());
  const upcomingN  = userOpps.filter(o => o.eventDate >= today).length;

  /* ── Calendar grid helpers ── */
  const grid       = getMonthGrid(year, month);
  const monthLabel = new Date(year, month).toLocaleDateString(
    isAr ? 'ar' : 'he', { month: 'long', year: 'numeric' },
  );
  const selKey     = dateKey(year, month, selectedDay);
  const dayOpps    = userOpps.filter(o => o.eventDate === selKey);

  const isToday = day =>
    year === now.getFullYear() && month === now.getMonth() && day === now.getDate();

  const shiftMonth = delta => {
    let m = month + delta;
    let y = year;
    if (m < 0)  { m = 11; y--; }
    if (m > 11) { m = 0;  y++; }
    setMonth(m);
    setYear(y);
    setSelectedDay(1);
  };

  /* ═══ EMPTY STATE: not logged in ═══ */
  if (!currentUser) {
    return (
      <EmptyShell isAr={isAr} t={t} currentUser={null}>
        <div className="text-center">
          <p className="text-7xl mb-5">🔐</p>
          <h2 className="text-2xl font-black text-gray-800 mb-3">
            {t('הלוח שלך ממתין לך', 'تقويمك بانتظارك')}
          </h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
            {t(
              'התחבר כדי לראות את הלוח האישי שלך עם כל הפעילויות שנרשמת אליהן',
              'سجّل دخولك لرؤية تقويمك الشخصي مع كل الأنشطة التي سجلت فيها',
            )}
          </p>
          <CtaBtn onClick={() => onNavigate?.('login')}>
            🔑 {t('כניסה', 'تسجيل الدخول')}
          </CtaBtn>
        </div>
      </EmptyShell>
    );
  }

  /* ═══ EMPTY STATE: logged in but no registered opportunities with dates ═══ */
  if (userOpps.length === 0) {
    return (
      <EmptyShell isAr={isAr} t={t} currentUser={currentUser}>
        <div className="text-center">
          <p className="text-7xl mb-5">🌱</p>
          <h2 className="text-2xl font-black text-gray-800 mb-3">
            {t('הלוח שלך עדיין ריק', 'تقويمك لا يزال فارغاً')}
          </h2>
          <p className="text-gray-600 font-semibold mb-2">
            {t('התחל לאסוף חוויות חדשות!', 'ابدأ بجمع تجارب جديدة!')}
          </p>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
            {t(
              'הירשם לפעילויות והזדמנויות כדי למלא את הלוח האישי שלך',
              'سجّل في الأنشطة والفرص لملء تقويمك الشخصي',
            )}
          </p>
          <CtaBtn onClick={() => onNavigate?.('opportunities')}>
            🔍 {t('גלה הזדמנויות', 'استكشف الفرص')}
          </CtaBtn>

          {/* Ghost placeholder cards */}
          <div className="mt-12 grid grid-cols-3 gap-2 opacity-20 pointer-events-none select-none" aria-hidden="true">
            {['🏀', '🎨', '🌿'].map((icon, i) => (
              <div key={i} className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm">
                <p className="text-2xl text-center">{icon}</p>
                <div className="h-2 bg-gray-200 rounded mt-2" />
                <div className="h-1.5 bg-gray-100 rounded mt-1.5" />
              </div>
            ))}
          </div>
        </div>
      </EmptyShell>
    );
  }

  /* ═══ MAIN CALENDAR VIEW ═══ */
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 animate-fade-in">

      {/* Personal header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-800 mb-2">
          📅 {t(
            `הלוח האישי של ${currentUser.name}`,
            `التقويم الشخصي لـ ${currentUser.name}`,
          )}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1
            bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
            ✅ {userOpps.length} {t('פעילויות רשומות', 'نشاط مسجل')}
          </span>
          {upcomingN > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1
              bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100">
              ⏳ {upcomingN} {t('קרובות', 'قادمة')}
            </span>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 items-start">

        {/* ── Calendar grid ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-5">
            <button
              onClick={() => shiftMonth(-1)}
              className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-600
                bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition min-h-[40px]">
              {t('◄ קודם', '◄ السابق')}
            </button>
            <span className="font-black text-gray-800 text-sm sm:text-base text-center px-2">
              {monthLabel}
            </span>
            <button
              onClick={() => shiftMonth(1)}
              className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-600
                bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition min-h-[40px]">
              {t('הבא ►', 'التالي ►')}
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center mb-2">
            {(isAr ? WEEK_AR : WEEK_HE).map(d => (
              <span key={d} className="text-xs font-bold text-gray-400 py-1">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
            {grid.map((day, i) => {
              if (!day) return <div key={`e-${i}`} />;
              const dk    = dateKey(year, month, day);
              const count = userOpps.filter(o => o.eventDate === dk).length;
              const sel   = day === selectedDay;
              const tod   = isToday(day);
              return (
                <button key={dk} onClick={() => setSelectedDay(day)}
                  className={`aspect-square rounded-xl text-xs sm:text-sm flex flex-col items-center
                    justify-center transition-all duration-150 min-h-[36px] font-semibold relative
                    ${sel
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100 scale-105'
                      : tod
                        ? 'bg-emerald-50 text-emerald-700 ring-2 ring-emerald-400 font-black'
                        : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'}
                    ${count > 0 && !sel ? 'font-bold' : ''}`}>
                  {day}
                  {count > 0 && (
                    <span className={`w-1.5 h-1.5 rounded-full mt-0.5
                      ${sel ? 'bg-white' : 'bg-emerald-500'}`} />
                  )}
                  {count > 1 && (
                    <span className={`absolute top-0.5 left-0.5 text-[9px] font-black leading-none
                      px-1 rounded-full ${sel ? 'bg-white/30 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right column: day panel + optional motivational card ── */}
        <div className="flex flex-col gap-4">

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-5
            lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
            <h2 className="font-black text-gray-700 mb-4 text-sm sm:text-base flex items-center gap-2">
              <span className="text-base">📆</span>
              {t(
                `פעילויות – ${formatIsraeliDate(selKey)}`,
                `نشاطات – ${formatIsraeliDate(selKey)}`,
              )}
            </h2>

            {dayOpps.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p className="text-4xl mb-3">🗓️</p>
                <p className="text-sm font-medium">
                  {t('אין לך פעילויות ביום זה', 'لا نشاطات لك في هذا اليوم')}
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {dayOpps.map(opp => (
                  <li key={opp.id}
                    className="border-2 border-gray-100 hover:border-emerald-200 rounded-2xl p-3.5
                      transition-all duration-150 hover:bg-emerald-50/30">
                    <div className="flex items-start gap-2.5">
                      <span className="text-2xl leading-none mt-0.5 shrink-0">{opp.icon ?? '📌'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 text-sm sm:text-base leading-snug">
                          {isAr ? opp.titleAr : opp.title}
                        </p>
                        <div className="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          {opp.startTime && (
                            <span>🕐 {opp.startTime}{opp.endTime ? `–${opp.endTime}` : ''}</span>
                          )}
                          <span>·</span>
                          <span>📍 {getCityName(opp.city, isAr)}</span>
                          <span>·</span>
                          <span>{getOrgName(opp.organizationId, isAr)}</span>
                        </div>
                        <button
                          onClick={() => onOpenOpp?.(opp)}
                          className="mt-2 text-xs font-bold text-emerald-700 bg-emerald-50
                            hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition min-h-[36px]
                            inline-flex items-center gap-1">
                          {t('פרטי הזדמנות', 'تفاصيل الفرصة')} →
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Motivational card for users with few activities */}
          {userOpps.length < FEW_THRESHOLD && (
            <div className="home-login-cta rounded-2xl p-5 text-white relative overflow-hidden">
              <div className="pointer-events-none absolute -top-6 -right-6 w-24 h-24
                rounded-full bg-white/5 animate-blob" />
              <div className="relative">
                <p className="font-black text-base mb-1">
                  🚀 {t(
                    `יש לך ${userOpps.length} ${userOpps.length === 1 ? 'פעילות' : 'פעילויות'} בלוח`,
                    `لديك ${userOpps.length} ${userOpps.length === 1 ? 'نشاط' : 'أنشطة'} في التقويم`,
                  )}
                </p>
                <p className="text-white/80 text-sm mb-4 leading-relaxed">
                  {t(
                    'גלה עוד הזדמנויות וצבור חוויות בלתי נשכחות!',
                    'استكشف المزيد من الفرص واجمع تجارب لا تُنسى!',
                  )}
                </p>
                <button
                  onClick={() => onNavigate?.('opportunities')}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5
                    bg-white text-[#6c4e9b] font-black rounded-xl text-sm
                    hover:scale-105 active:scale-95 transition-all shadow-lg">
                  🔍 {t('גלה הזדמנויות', 'استكشف الفرص')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Shared wrapper for the two empty-state screens ── */
function EmptyShell({ isAr, t, currentUser, children }) {
  const name = currentUser?.name;
  return (
    <div className="animate-fade-in min-h-[calc(100vh-5rem)] flex flex-col">
      {/* Hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-bl from-emerald-700 via-emerald-600 to-teal-500
        text-white px-4 py-12 sm:py-16 text-center">
        <div className="pointer-events-none absolute -top-16 -right-12 w-56 h-56 rounded-full
          bg-white/5 animate-blob" />
        <div className="pointer-events-none absolute -bottom-10 -left-8 w-48 h-48 rounded-full
          bg-teal-900/20 animate-blob" style={{ animationDelay: '4s' }} />
        <div className="relative">
          <p className="text-5xl mb-4">📅</p>
          <h1 className="text-2xl sm:text-3xl font-black mb-2">
            {name
              ? (isAr ? `التقويم الشخصي لـ ${name}` : `הלוח האישי של ${name}`)
              : (isAr ? 'تقويمي الشخصي' : 'הלוח האישי שלי')}
          </h1>
          <p className="text-emerald-100 text-sm max-w-xs mx-auto leading-relaxed">
            {isAr
              ? 'الأنشطة التي سجلت فيها ستظهر هنا'
              : 'פעילויות שנרשמת אליהן יופיעו כאן'}
          </p>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-14
        bg-gradient-to-b from-emerald-50/40 to-white">
        <div className="max-w-sm w-full">
          {children}
        </div>
      </div>
    </div>
  );
}

function CtaBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-8 py-4
        bg-gradient-to-l from-emerald-600 to-teal-500
        hover:from-emerald-700 hover:to-teal-600
        text-white font-black rounded-2xl text-base
        transition-all duration-200 shadow-lg shadow-emerald-100
        hover:scale-105 active:scale-95">
      {children}
    </button>
  );
}

export default EventsCalendar;
