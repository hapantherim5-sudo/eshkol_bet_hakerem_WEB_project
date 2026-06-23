import { useState, useEffect, useMemo } from 'react';
import { ORGANIZATIONS } from '../data/organizations';
import { CATEGORIES } from '../data/fakeData';

/* ── Carousel constants ── */
const ROTATION_MS = 5000;
const FADE_MS     = 280;

function calcCd(isoDate) {
  const diff = Math.max(0, new Date(isoDate).getTime() - Date.now());
  const s    = Math.floor(diff / 1000);
  return {
    days:    Math.floor(s / 86400),
    hours:   Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600)  / 60),
    seconds: s % 60,
  };
}
const p2 = (n) => String(n).padStart(2, '0');

const QUICK_LINKS = [
  { screen: 'opportunities', icon: '🔍', labelHe: 'גלה הזדמנויות', labelAr: 'استكشف الفرص',       gradient: 'from-emerald-400 to-teal-500',   shadow: 'hover:shadow-emerald-200' },
  { screen: 'hot-this-week', icon: '🔥', labelHe: 'חם השבוע',        labelAr: 'الأكثر رواجاً',      gradient: 'from-orange-400 to-red-500',     shadow: 'hover:shadow-orange-200' },
  { screen: 'calendar',      icon: '📅', labelHe: 'לוח אירועים',     labelAr: 'التقويم',            gradient: 'from-violet-400 to-purple-500',  shadow: 'hover:shadow-violet-200' },
  { screen: 'gallery',       icon: '📸', labelHe: 'גלריה',            labelAr: 'معرض الصور',         gradient: 'from-cyan-400 to-teal-500',      shadow: 'hover:shadow-cyan-200'   },
];

const COMMUNITY_PERKS = [
  { icon: '🏆', titleHe: 'פיתוח עצמי',      titleAr: 'التطوير الذاتي', textHe: 'חוגים, הדרכות וסדנאות שיפתחו את הכישרון שלך', textAr: 'حلقات وتدريبات وورش ستطور موهبتك', color: 'text-amber-600',   bg: 'bg-amber-50' },
  { icon: '🤝', titleHe: 'חברויות חדשות',   titleAr: 'صداقات جديدة',   textHe: 'הכר נוער מכל הרקעים ובן עמם קהילה חזקה',      textAr: 'تعرف على شباب من كل الخلفيات وابنِ معهم مجتمعاً',  color: 'text-pink-600',    bg: 'bg-pink-50'  },
  { icon: '🚀', titleHe: 'ניסיון מעשי',     titleAr: 'خبرة عملية',     textHe: 'צבור נקודות, הישגים ו-CV שיפתחו דלתות',      textAr: 'اجمع نقاطاً وإنجازات وسيرة ذاتية تفتح الأبواب',     color: 'text-violet-600', bg: 'bg-violet-50' },
  { icon: '🌍', titleHe: 'קהילה ושייכות',   titleAr: 'مجتمع وانتماء',  textHe: 'חלק מתנועה שמשנה את הקהילה שלנו לטובה',       textAr: 'كن جزءاً من حركة تغيّر مجتمعنا للأفضل',           color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

function HomePage({ store, currentUser, isAr, handleNavigate }) {
  const statItems = [
    { num: store.opportunities.length, labelHe: 'הזדמנויות', labelAr: 'فرصة', icon: '🎯', gradient: 'from-emerald-400 to-teal-500' },
    { num: ORGANIZATIONS.length,       labelHe: 'ארגונים',    labelAr: 'جهة',  icon: '🏢', gradient: 'from-violet-400 to-purple-500' },
    { num: CATEGORIES.length,          labelHe: 'קטגוריות',   labelAr: 'فئה',  icon: '✨', gradient: 'from-amber-400 to-orange-500' },
  ];

  /* ── Carousel: build items from open opportunities + nearest future event ── */
  const carouselItems = useMemo(() => {
    const open = store.opportunities.filter(
      o => o.status === 'פתוח' || o.status === 'מקומות אחרונים'
    );
    const pool = (open.length >= 3 ? open : store.opportunities).slice(0, 5);
    const now  = Date.now();
    return pool.map(opp => {
      const ev = (store.events ?? [])
        .filter(e => e.opportunityId === opp.id && e.startsAt && new Date(e.startsAt).getTime() > now)
        .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt))[0];
      return { opp, eventDate: ev?.startsAt ?? null };
    });
  }, [store.opportunities, store.events]);

  const [idx,     setIdx    ] = useState(0);
  const [visible, setVisible] = useState(true);
  const [cd,      setCd     ] = useState(null);

  const safeIdx      = carouselItems.length > 0 ? Math.min(idx, carouselItems.length - 1) : 0;
  const currentItem  = carouselItems[safeIdx];
  const featuredOpp  = currentItem?.opp ?? store.opportunities[0];
  const eventDate    = currentItem?.eventDate ?? null;

  /* Countdown ticker — restarts whenever the active event date changes */
  useEffect(() => {
    if (!eventDate) { setCd(null); return; }
    setCd(calcCd(eventDate));
    const id = setInterval(() => setCd(calcCd(eventDate)), 1000);
    return () => clearInterval(id);
  }, [eventDate]);

  /* Auto-rotation */
  useEffect(() => {
    if (carouselItems.length <= 1) return;
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(prev => (prev + 1) % carouselItems.length);
        setVisible(true);
      }, FADE_MS);
    }, ROTATION_MS);
    return () => clearInterval(id);
  }, [carouselItems.length]);

  const goTo = (next) => {
    if (next === safeIdx) return;
    setVisible(false);
    setTimeout(() => { setIdx(next); setVisible(true); }, FADE_MS);
  };

  const featuredCat = featuredOpp ? CATEGORIES.find(c => c.id === featuredOpp.category) : null;

  return (
    <div className="animate-fade-in">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-bl from-emerald-700 via-emerald-600 to-teal-500 text-white">
        <div className="pointer-events-none absolute -top-24 -right-16 w-80 h-80 rounded-full bg-white/5 animate-blob" />
        <div className="pointer-events-none absolute -bottom-16 -left-12 w-64 h-64 rounded-full bg-teal-900/20 animate-blob" style={{ animationDelay: '4s' }} />
        <div className="pointer-events-none absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-white/[0.03]" />

        <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-1.5 mb-5 px-4 py-1.5 bg-white/20 backdrop-blur-sm
            rounded-full text-xs font-semibold tracking-wide border border-white/30">
            <span>🌟</span>
            <span>{isAr ? 'منصة الشباب' : 'הפלטפורמה לבני הנוער'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black mb-4 leading-tight">
            {isAr ? 'اكتشف فرصتك' : 'גלה את ההזדמנות שלך'}
          </h1>

          <p className="text-emerald-100 mb-10 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {isAr
              ? 'تطوع، رياضة، فنون، مجتمع — جميع فرص شباب عنقود بيت هكيريم في مكان واحد'
              : 'התנדבות, ספורט, אמנות, קהילה — כל ההזדמנויות של אשכול בית הכרם במקום אחד'}
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => handleNavigate('opportunities')}
              className="px-8 py-3.5 bg-white text-emerald-700 font-black rounded-2xl
                hover:bg-emerald-50 hover:scale-105 active:scale-95
                transition-all duration-200 shadow-xl text-base tracking-wide">
              {isAr ? '🔍 استكشف الفرص' : '🔍 גלה הזדמנויות'}
            </button>
            <button onClick={() => handleNavigate('hot-this-week')}
              className="px-8 py-3.5 bg-white/10 text-white font-bold rounded-2xl
                hover:bg-white/20 hover:scale-105 active:scale-95
                transition-all duration-200 border border-white/40 text-base backdrop-blur-sm">
              {isAr ? '🔥 الأكثر رواجاً' : '🔥 חם השבוע'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid grid-cols-3 gap-3 sm:gap-5">
            {statItems.map((s, i) => (
              <div key={i}
                className="text-center hover:-translate-y-0.5 transition-transform duration-200">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${s.gradient}
                  flex items-center justify-center text-2xl mx-auto mb-2 shadow-md`}>
                  {s.icon}
                </div>
                <p className="text-2xl sm:text-4xl font-black text-gray-800">{s.num}</p>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  {isAr ? s.labelAr : s.labelHe}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10">

        {/* ── Quick Links Grid ── */}
        <section>
          <h2 className="text-xl font-black text-gray-800 mb-4">
            {isAr ? '⚡ وصول سريع' : '⚡ גישה מהירה'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_LINKS.map((ql, i) => (
              <button key={i}
                onClick={() => handleNavigate(ql.screen)}
                className={`relative overflow-hidden rounded-2xl p-5 text-white text-right
                  bg-gradient-to-br ${ql.gradient} shadow-md ${ql.shadow}
                  hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all duration-200
                  animate-card-in`}
                style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="pointer-events-none absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10" />
                <p className="text-3xl mb-2">{ql.icon}</p>
                <p className="text-sm font-black leading-tight">
                  {isAr ? ql.labelAr : ql.labelHe}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* ── Hot This Week Carousel ── */}
        {featuredOpp && (
          <section>
            <h2 className="text-xl font-black text-gray-800 mb-4">
              {isAr ? '🔥 الأكثر رواجاً هذا الأسبوع' : '🔥 חם השבוע'}
            </h2>

            {/* Card container — hover/click behaviour unchanged */}
            <div
              onClick={() => handleNavigate('opportunities')}
              className="relative overflow-hidden bg-gradient-to-bl from-indigo-600 via-violet-600 to-purple-500
                rounded-3xl p-6 sm:p-8 text-white cursor-pointer
                hover:shadow-2xl hover:shadow-violet-200 hover:-translate-y-1 transition-all duration-300">
              <div className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5 animate-blob" />
              <div className="pointer-events-none absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-indigo-900/15 animate-blob" style={{ animationDelay: '2s' }} />

              {/* Fadeable content — only the inner content transitions, not the card shell */}
              <div
                className="relative"
                style={{ transition: `opacity ${FADE_MS}ms ease`, opacity: visible ? 1 : 0 }}
              >
                {/* ── Existing layout: icon + badges + title + description ── */}
                <div className="flex items-center gap-5">
                  <span className="text-5xl sm:text-6xl shrink-0">{featuredOpp.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="px-2.5 py-1 bg-white/20 rounded-lg text-xs font-black border border-white/30">
                        🔥 {isAr ? 'الأكثر رواجاً' : 'חם השבוע'}
                      </span>
                      {featuredCat && (
                        <span className="px-2.5 py-1 bg-white/15 rounded-lg text-xs font-semibold border border-white/20">
                          {featuredCat.icon} {isAr ? featuredCat.labelAr : featuredCat.label}
                        </span>
                      )}
                      <span className="px-2.5 py-1 bg-white/20 rounded-lg text-xs font-semibold border border-white/25">
                        📍 {featuredOpp.city}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-2xl font-black leading-tight mb-1">
                      {isAr ? featuredOpp.titleAr : featuredOpp.title}
                    </h3>
                    <p className="text-indigo-200 text-sm line-clamp-2">
                      {isAr && featuredOpp.descriptionAr ? featuredOpp.descriptionAr : featuredOpp.description}
                    </p>
                  </div>
                </div>

                {/* ── Compact countdown + carousel dots ── */}
                <div className="mt-4 pt-3.5 border-t border-white/20 flex items-center justify-between gap-3">

                  {/* Countdown boxes (only when a future event date exists) */}
                  {cd ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-white/45 text-xs shrink-0">⏱</span>
                      <div className="flex gap-1">
                        {[
                          { v: cd.days,    lHe: 'ימים',   lAr: 'يوم'   },
                          { v: cd.hours,   lHe: 'שעות',  lAr: 'ساعة'  },
                          { v: cd.minutes, lHe: 'דקות',  lAr: 'دقيقة' },
                          { v: cd.seconds, lHe: 'שניות', lAr: 'ثانية' },
                        ].map(({ v, lHe, lAr }) => (
                          <div key={lHe}
                            className="text-center bg-white/15 rounded-lg px-1.5 py-1 min-w-[36px]">
                            <p className="text-sm font-black tabular-nums leading-none">{p2(v)}</p>
                            <p className="text-white/45 text-[8px] font-semibold leading-none mt-0.5">
                              {isAr ? lAr : lHe}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-white/40 text-xs font-semibold">
                      📅 {isAr ? 'قريباً' : 'בקרוב'}
                    </p>
                  )}

                  {/* Navigation dots */}
                  {carouselItems.length > 1 && (
                    <div className="flex gap-1.5 shrink-0">
                      {carouselItems.map((_, i) => (
                        <button
                          key={i}
                          onClick={e => { e.stopPropagation(); goTo(i); }}
                          aria-label={`${isAr ? 'انتقل إلى' : 'עבור לפעילות'} ${i + 1}`}
                          className={`rounded-full transition-all duration-300
                            ${i === safeIdx
                              ? 'w-5 h-2 bg-white shadow-sm'
                              : 'w-2 h-2 bg-white/35 hover:bg-white/65'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Community Perks ── */}
        <section>
          <div className="text-center mb-6">
            <h2 className="text-xl font-black text-gray-800 mb-1">
              {isAr ? '💫 لماذا تنضم إلينا؟' : '💫 למה להצטרף?'}
            </h2>
            <p className="text-sm text-gray-500">
              {isAr ? 'ما الذي يميّز أشكول بيت هكيريم' : 'מה שמייחד את אשכול בית הכרם'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COMMUNITY_PERKS.map((p, i) => (
              <div key={i}
                className={`${p.bg} rounded-2xl p-5 border border-white/50
                  hover:-translate-y-0.5 transition-transform duration-200 animate-card-in`}
                style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="flex items-start gap-3">
                  <span className="text-3xl shrink-0">{p.icon}</span>
                  <div>
                    <p className={`font-black text-gray-800 text-sm mb-1 ${p.color}`}>
                      {isAr ? p.titleAr : p.titleHe}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {isAr ? p.textAr : p.textHe}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA or User Welcome ── */}
        {currentUser?.role === 'User' ? (
          <section>
            <div className="bg-gradient-to-l from-emerald-50 to-teal-50 border border-emerald-100
              rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-right">
                <p className="font-black text-gray-800 text-base">
                  {isAr ? `مرحباً، ${currentUser.name}! 👋` : `שלום, ${currentUser.name}! 👋`}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {isAr ? 'تابع نشاطاتك المسجلة' : 'עקוב אחרי ההרשמות שלך'}
                </p>
              </div>
              <button onClick={() => handleNavigate('my-registrations')}
                className="shrink-0 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold
                  rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md text-sm">
                {isAr ? 'نشاطاتي ←' : '← ההרשמות שלי'}
              </button>
            </div>
          </section>
        ) : !currentUser ? (
          <section>
            <div className="relative overflow-hidden bg-gradient-to-l from-violet-600 to-indigo-600
              rounded-2xl p-6 text-white">
              <div className="pointer-events-none absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 animate-blob" />
              <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
                <div>
                  <p className="font-black text-xl mb-1">
                    {isAr ? 'انضم إلى مجتمعنا اليوم! 🎉' : 'הצטרף לקהילה שלנו היום! 🎉'}
                  </p>
                  <p className="text-violet-200 text-sm">
                    {isAr ? 'سجّل دخولك لمتابعة نشاطاتك والتسجيل في الفرص' : 'התחבר כדי לעקוב אחרי ההרשמות שלך ולהירשם להזדמנויות'}
                  </p>
                </div>
                <button onClick={() => handleNavigate('login')}
                  className="shrink-0 px-7 py-3 bg-white text-violet-700 font-black
                    rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg text-sm">
                  {isAr ? 'سجّل الدخول الآن' : 'כניסה עכשיו →'}
                </button>
              </div>
            </div>
          </section>
        ) : null}

      </div>
    </div>
  );
}

export default HomePage;
