import { useState, useEffect, useMemo } from 'react';
import { ORGANIZATIONS } from '../data/organizations';
import { CATEGORIES } from '../data/fakeData';
import { useT } from '../i18n/i18n';

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

function HomePage({ store, currentUser, lang, handleNavigate }) {
  const t = useT(lang);
  const isAr = lang === 'ar';

  const QUICK_LINKS = [
    { screen: 'opportunities', icon: '🔍', label: t('home_quick_explore'), gradient: 'from-emerald-400 to-teal-500',  shadow: 'hover:shadow-emerald-200' },
    { screen: 'hot-this-week', icon: '🔥', label: t('home_quick_hot'),     gradient: 'from-orange-400 to-red-500',    shadow: 'hover:shadow-orange-200' },
    { screen: 'calendar',      icon: '📅', label: t('home_quick_calendar'),gradient: 'from-violet-400 to-purple-500', shadow: 'hover:shadow-violet-200' },
    { screen: 'gallery',       icon: '📸', label: t('home_quick_gallery'), gradient: 'from-cyan-400 to-teal-500',     shadow: 'hover:shadow-cyan-200'   },
  ];

  const COMMUNITY_PERKS = [
    { icon: '🏆', title: t('home_perks_selfdev_title'),    text: t('home_perks_selfdev_text'),    color: 'text-amber-600',   bg: 'bg-amber-50' },
    { icon: '🤝', title: t('home_perks_friends_title'),    text: t('home_perks_friends_text'),    color: 'text-pink-600',    bg: 'bg-pink-50'  },
    { icon: '🚀', title: t('home_perks_experience_title'), text: t('home_perks_experience_text'), color: 'text-violet-600',  bg: 'bg-violet-50' },
    { icon: '🌍', title: t('home_perks_community_title'),  text: t('home_perks_community_text'),  color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const statItems = [
    { num: store.opportunities.length, label: t('home_stat_opportunities'), icon: '🎯', gradient: 'from-emerald-400 to-teal-500' },
    { num: ORGANIZATIONS.length,       label: t('home_stat_organizations'), icon: '🏢', gradient: 'from-violet-400 to-purple-500' },
    { num: CATEGORIES.length,          label: t('home_stat_categories'),    icon: '✨', gradient: 'from-amber-400 to-orange-500' },
  ];

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

  const safeIdx     = carouselItems.length > 0 ? Math.min(idx, carouselItems.length - 1) : 0;
  const currentItem = carouselItems[safeIdx];
  const featuredOpp = currentItem?.opp ?? store.opportunities[0];
  const eventDate   = currentItem?.eventDate ?? null;

  useEffect(() => {
    if (!eventDate) { setCd(null); return; }
    setCd(calcCd(eventDate));
    const id = setInterval(() => setCd(calcCd(eventDate)), 1000);
    return () => clearInterval(id);
  }, [eventDate]);

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

  const CD_LABELS = [
    { key: 'days',    he: 'ימים',   ar: 'يوم'   },
    { key: 'hours',   he: 'שעות',  ar: 'ساعة'  },
    { key: 'minutes', he: 'דקות',  ar: 'دقيقة' },
    { key: 'seconds', he: 'שניות', ar: 'ثانية' },
  ];

  return (
    <div className="animate-fade-in">

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-bl from-emerald-700 via-emerald-600 to-teal-500 text-white">
        <div className="pointer-events-none absolute -top-24 -right-16 w-80 h-80 rounded-full bg-white/5 animate-blob" />
        <div className="pointer-events-none absolute -bottom-16 -left-12 w-64 h-64 rounded-full bg-teal-900/20 animate-blob" style={{ animationDelay: '4s' }} />

        <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-1.5 mb-5 px-4 py-1.5 bg-white/20 backdrop-blur-sm
            rounded-full text-xs font-semibold tracking-wide border border-white/30">
            <span>🌟</span>
            <span>{t('home_platform_badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black mb-4 leading-tight">
            {t('home_hero_title')}
          </h1>

          <p className="text-emerald-100 mb-10 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {t('home_hero_subtitle')}
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => handleNavigate('opportunities')}
              className="px-8 py-3.5 bg-white text-emerald-700 font-black rounded-2xl
                hover:bg-emerald-50 hover:scale-105 active:scale-95
                transition-all duration-200 shadow-xl text-base tracking-wide">
              {t('home_explore_btn')}
            </button>
            <button onClick={() => handleNavigate('hot-this-week')}
              className="px-8 py-3.5 bg-white/10 text-white font-bold rounded-2xl
                hover:bg-white/20 hover:scale-105 active:scale-95
                transition-all duration-200 border border-white/40 text-base backdrop-blur-sm">
              {t('home_hot_btn')}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid grid-cols-3 gap-3 sm:gap-5">
            {statItems.map((s, i) => (
              <div key={i} className="text-center hover:-translate-y-0.5 transition-transform duration-200">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${s.gradient}
                  flex items-center justify-center text-2xl mx-auto mb-2 shadow-md`}>
                  {s.icon}
                </div>
                <p className="text-2xl sm:text-4xl font-black text-gray-800">{s.num}</p>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10">

        {/* Quick Links */}
        <section>
          <h2 className="text-xl font-black text-gray-800 mb-4">{t('home_quick_links_title')}</h2>
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
                <p className="text-sm font-black leading-tight">{ql.label}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Carousel */}
        {featuredOpp && (
          <section>
            <h2 className="text-xl font-black text-gray-800 mb-4">{t('home_featured_title')}</h2>

            <div
              onClick={() => handleNavigate('opportunities')}
              className="relative overflow-hidden bg-gradient-to-bl from-indigo-600 via-violet-600 to-purple-500
                rounded-3xl p-6 sm:p-8 text-white cursor-pointer
                hover:shadow-2xl hover:shadow-violet-200 hover:-translate-y-1 transition-all duration-300">
              <div className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5 animate-blob" />
              <div className="pointer-events-none absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-indigo-900/15 animate-blob" style={{ animationDelay: '2s' }} />

              <div className="relative" style={{ transition: `opacity ${FADE_MS}ms ease`, opacity: visible ? 1 : 0 }}>
                <div className="flex items-center gap-5">
                  <span className="text-5xl sm:text-6xl shrink-0">{featuredOpp.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="px-2.5 py-1 bg-white/20 rounded-lg text-xs font-black border border-white/30">
                        🔥 {t('home_featured_badge')}
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

                <div className="mt-4 pt-3.5 border-t border-white/20 flex items-center justify-between gap-3">
                  {cd ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-white/45 text-xs shrink-0">⏱</span>
                      <div className="flex gap-1">
                        {CD_LABELS.map(({ key, he: lHe, ar: lAr }) => (
                          <div key={key}
                            className="text-center bg-white/15 rounded-lg px-1.5 py-1 min-w-[36px]">
                            <p className="text-sm font-black tabular-nums leading-none">{p2(cd[key])}</p>
                            <p className="text-white/45 text-[8px] font-semibold leading-none mt-0.5">
                              {isAr ? lAr : lHe}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-white/40 text-xs font-semibold">{t('home_featured_soon')}</p>
                  )}

                  {carouselItems.length > 1 && (
                    <div className="flex gap-1.5 shrink-0">
                      {carouselItems.map((_, i) => (
                        <button
                          key={i}
                          onClick={e => { e.stopPropagation(); goTo(i); }}
                          aria-label={`${t('home_carousel_goto')} ${i + 1}`}
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

        {/* Community Perks */}
        <section>
          <div className="text-center mb-6">
            <h2 className="text-xl font-black text-gray-800 mb-1">{t('home_why_title')}</h2>
            <p className="text-sm text-gray-500">{t('home_why_subtitle')}</p>
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
                    <p className={`font-black text-gray-800 text-sm mb-1 ${p.color}`}>{p.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{p.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        {currentUser?.role === 'User' ? (
          <section>
            <div className="bg-gradient-to-l from-emerald-50 to-teal-50 border border-emerald-100
              rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-right">
                <p className="font-black text-gray-800 text-base">
                  {isAr ? `مرحباً، ${currentUser.name}! 👋` : `שלום, ${currentUser.name}! 👋`}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">{t('home_welcome_subtitle')}</p>
              </div>
              <button onClick={() => handleNavigate('my-registrations')}
                className="shrink-0 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold
                  rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md text-sm">
                {t('home_my_registrations_btn')}
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
                  <p className="font-black text-xl mb-1">{t('home_cta_title')}</p>
                  <p className="text-violet-200 text-sm">{t('home_cta_subtitle')}</p>
                </div>
                <button onClick={() => handleNavigate('login')}
                  className="shrink-0 px-7 py-3 bg-white text-violet-700 font-black
                    rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg text-sm">
                  {t('home_cta_login_btn')}
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