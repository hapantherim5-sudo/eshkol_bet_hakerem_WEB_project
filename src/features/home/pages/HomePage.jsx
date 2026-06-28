// File: src/pages/HomePage.jsx
// Purpose: HomePage component
// Role: React page component for HomePage

import { useEffect, useState } from 'react';
import { useT } from '../../../i18n/i18n';
import { GALLERY_ITEMS } from '../../../data/galleryItems';

const HERO_GALLERY_ITEMS = GALLERY_ITEMS.slice(0, 6);

const STATS = [
  { num: '500+', labelKey: 'home_stat_active_youth', icon: '👥' },
  { num: '10', labelKey: 'home_stat_cities', icon: '🏘️' },
  { num: '6', labelKey: 'home_stat_categories', icon: '✨' },
  { num: '3', labelKey: 'home_stat_years', icon: '🗓️' },
];

const MISSION_CARDS = [
  {
    icon: '🌱',
    titleKey: 'home_mission_growth_title',
    textKey: 'home_mission_growth_text',
  },
  {
    icon: '🤝',
    titleKey: 'home_mission_belonging_title',
    textKey: 'home_mission_belonging_text',
  },
  {
    icon: '🚀',
    titleKey: 'home_mission_opportunities_title',
    textKey: 'home_mission_opportunities_text',
  },
];

const VALUES = [
  { icon: '💡', titleKey: 'home_value_innovation_title', textKey: 'home_value_innovation_text' },
  { icon: '🌍', titleKey: 'home_value_diversity_title', textKey: 'home_value_diversity_text' },
  { icon: '🏆', titleKey: 'home_value_excellence_title', textKey: 'home_value_excellence_text' },
  { icon: '❤️', titleKey: 'home_value_care_title', textKey: 'home_value_care_text' },
];

const TEAM = [
  { nameKey: 'home_team_1_name', roleKey: 'home_team_1_role', emoji: '👩‍💼' },
  { nameKey: 'home_team_2_name', roleKey: 'home_team_2_role', emoji: '👨‍🏫' },
  { nameKey: 'home_team_3_name', roleKey: 'home_team_3_role', emoji: '👩‍🎨' },
  { nameKey: 'home_team_4_name', roleKey: 'home_team_4_role', emoji: '🏅' },
];

// HomePage — renders HomePage
function HomePage({ currentUser, lang, handleNavigate, opportunitiesCount }) {
  const t = useT(lang);
  const [heroSlide, setHeroSlide] = useState(0);
  const stats = [
    ...STATS.slice(0, 2),
    { num: opportunitiesCount, labelKey: 'home_stat_opportunities', icon: '🎯' },
    ...STATS.slice(2),
  ];

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const intervalId = window.setInterval(() => {
      setHeroSlide(current => (current + 1) % HERO_GALLERY_ITEMS.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="relative overflow-hidden bg-[#395247] text-white">
        <div className="absolute inset-0" aria-hidden="true">
          {HERO_GALLERY_ITEMS.map((item, index) => (
            <img
              key={item.id}
              src={item.src}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${index === heroSlide ? 'scale-105 opacity-100' : 'scale-100 opacity-0'}`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-bl from-emerald-950/80 via-[#395247]/75 to-teal-800/75" />
        </div>
        <div className="pointer-events-none absolute -top-24 -right-16 h-80 w-80 rounded-full bg-white/5 animate-blob" />
        <div className="pointer-events-none absolute -bottom-16 -left-12 h-64 w-64 rounded-full bg-black/10 animate-blob" style={{ animationDelay: '4s' }} />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 text-center sm:py-24">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-xs font-semibold tracking-wide backdrop-blur-sm">
            <span>🌟</span><span>{t('home_platform_badge')}</span>
          </div>
          <h1 className="mb-4 text-3xl font-black leading-tight sm:text-5xl">{t('home_hero_title')}</h1>
          <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-emerald-100 sm:text-lg">{t('home_hero_subtitle')}</p>
          <button onClick={() => handleNavigate('opportunities')} className="home-hero-explore rounded-2xl bg-white px-8 py-3.5 text-base font-black tracking-wide text-emerald-700 shadow-xl transition-all duration-200 hover:scale-105 hover:bg-emerald-50 active:scale-95">
            {t('home_explore_btn')}
          </button>
          <div className="mt-6 flex justify-center gap-2" aria-hidden="true">
            {HERO_GALLERY_ITEMS.map((item, index) => (
              <span key={item.id} className={`h-1.5 rounded-full bg-white transition-all duration-500 ${index === heroSlide ? 'w-7 opacity-100' : 'w-1.5 opacity-45'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="home-about-stats border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-7">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-5">
            {stats.map(item => (
              <div key={item.labelKey} className="text-center last:col-span-2 sm:last:col-span-1">
                <div className="mb-1 text-2xl">{item.icon}</div>
                <p className="text-3xl font-black text-gray-800 sm:text-4xl">{item.num}</p>
                <p className="mt-1 text-xs font-bold text-gray-500">{t(item.labelKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-14 px-4 py-10 sm:py-14">
        <section>
          <div className="mb-7 text-center">
            <span className="inline-block rounded-full bg-[#f2eef7] px-4 py-1 text-xs font-bold text-[#6c4e9b]">{t('about_identity_badge')}</span>
            <h2 className="mt-3 text-2xl font-black text-gray-800 sm:text-3xl">{t('about_identity_title')}</h2>
          </div>
          <div className="about-home-intro grid items-center gap-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:grid-cols-[1.3fr_0.7fr] sm:p-8">
            <div className="space-y-3 text-sm leading-7 text-gray-600 sm:text-base">
              <p>{t('about_para1')}</p>
              <p>{t('about_para2')}</p>
              <p>{t('about_para3')}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🏘️', label: t('about_cities_label') },
                { icon: '🎯', label: t('about_cats_label') },
                { icon: '👥', label: t('about_growing_label') },
                { icon: '🌐', label: t('about_bilingual_label') },
              ].map(item => (
                <div key={item.label} className="about-info-card rounded-2xl border border-[#dfd2eb] bg-white p-4 text-center">
                  <div className="mb-2 text-2xl">{item.icon}</div>
                  <p className="text-xs font-bold text-gray-700">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="mb-7 text-center">
            <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-xs font-bold text-emerald-700">{t('about_mission_badge')}</span>
            <h2 className="mt-3 text-2xl font-black text-gray-800 sm:text-3xl">{t('about_mission_title')}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {MISSION_CARDS.map((card, index) => (
              <article key={card.titleKey} className="about-mission-card rounded-2xl border border-gray-100 bg-white p-6 shadow-sm animate-card-in" style={{ animationDelay: `${index * 0.08}s` }}>
                <div className="mb-4 text-4xl">{card.icon}</div>
                <h3 className="text-base font-black text-gray-800">{t(card.titleKey)}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{t(card.textKey)}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-7 text-center">
            <span className="inline-block rounded-full bg-amber-100 px-4 py-1 text-xs font-bold text-amber-700">{t('about_values_badge')}</span>
            <h2 className="mt-3 text-2xl font-black text-gray-800 sm:text-3xl">{t('about_values_title')}</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {VALUES.map((value, index) => (
              <article key={value.titleKey} className="about-value-card rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm animate-card-in" style={{ animationDelay: `${index * 0.06}s` }}>
                <div className="mb-2 text-3xl">{value.icon}</div>
                <h3 className="text-sm font-black text-gray-800">{t(value.titleKey)}</h3>
                <p className="mt-1 text-xs leading-5 text-gray-500">{t(value.textKey)}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-7 text-center">
            <span className="inline-block rounded-full bg-pink-100 px-4 py-1 text-xs font-bold text-pink-700">{t('about_team_badge')}</span>
            <h2 className="mt-3 text-2xl font-black text-gray-800 sm:text-3xl">{t('about_team_title')}</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TEAM.map((member, index) => (
              <article key={member.nameKey} className="about-team-card rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm animate-card-in" style={{ animationDelay: `${index * 0.07}s` }}>
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f2eef7] text-3xl">{member.emoji}</div>
                <h3 className="text-sm font-black text-gray-800">{t(member.nameKey)}</h3>
                <p className="mt-1 text-xs font-medium text-gray-500">{t(member.roleKey)}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="about-home-cta relative overflow-hidden rounded-3xl bg-gradient-to-bl from-emerald-600 via-teal-600 to-cyan-500 p-8 text-center text-white sm:p-10">
            <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/5 animate-blob" />
            <div className="relative">
              <div className="mb-3 text-4xl">🌟</div>
              <h2 className="text-2xl font-black sm:text-3xl">{t('about_cta_title')}</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-emerald-100 sm:text-base">{t('about_cta_subtitle')}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {!currentUser && (
                  <>
                    <button onClick={() => handleNavigate('register')} className="rounded-xl bg-white px-6 py-3 text-sm font-black text-emerald-700 shadow-lg transition hover:scale-105">{t('nav_register_btn')}</button>
                    <button onClick={() => handleNavigate('login')} className="rounded-xl border border-white/40 bg-white/15 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/25">{t('nav_login_btn')}</button>
                  </>
                )}
                {currentUser?.role === 'User' && (
                  <button onClick={() => handleNavigate('my-registrations')} className="rounded-xl bg-white px-6 py-3 text-sm font-black text-emerald-700 shadow-lg transition hover:scale-105">{t('home_my_registrations_btn')}</button>
                )}
                <a href="mailto:info@bkerem.org.il" className="rounded-xl border border-white/30 bg-white/15 px-5 py-3 text-sm font-bold text-white">{t('about_contact_email')}</a>
                <span className="rounded-xl border border-white/30 bg-white/15 px-5 py-3 text-sm font-bold">{t('about_contact_location')}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
