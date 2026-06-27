import { ORGANIZATIONS } from '../data/organizations';
import { CATEGORIES } from '../data/fakeData';
import { useT } from '../i18n/i18n';

function HomePage({ store, currentUser, lang, handleNavigate }) {
  const t = useT(lang);
  const isAr = lang === 'ar';
  const QUICK_LINKS = [
    { screen: 'opportunities', icon: '🔍', label: t('home_quick_explore'), gradient: 'from-emerald-400 to-teal-500',  shadow: 'hover:shadow-emerald-200' },
    { screen: 'calendar',      icon: '📅', label: t('home_quick_calendar'),gradient: 'plum-gradient',                  shadow: 'hover:shadow-[#cdb7dc]' },
    { screen: 'gallery',       icon: '📸', label: t('home_quick_gallery'), gradient: 'from-cyan-400 to-teal-500',     shadow: 'hover:shadow-cyan-200'   },
  ];

  const COMMUNITY_PERKS = [
    { icon: '🏆', title: t('home_perks_selfdev_title'),    text: t('home_perks_selfdev_text'),    color: 'text-amber-600',   bg: 'bg-amber-50' },
    { icon: '🤝', title: t('home_perks_friends_title'),    text: t('home_perks_friends_text'),    color: 'text-pink-600',    bg: 'bg-pink-50'  },
    { icon: '🚀', title: t('home_perks_experience_title'), text: t('home_perks_experience_text'), color: 'text-[#6c4e9b]',  bg: 'bg-[#f2eef7]' },
    { icon: '🌍', title: t('home_perks_community_title'),  text: t('home_perks_community_text'),  color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const statItems = [
    { num: store.opportunities.length, label: t('home_stat_opportunities'), icon: '🎯', gradient: 'from-emerald-400 to-teal-500' },
    { num: ORGANIZATIONS.length,       label: t('home_stat_organizations'), icon: '🏢', gradient: 'plum-gradient' },
    { num: CATEGORIES.length,          label: t('home_stat_categories'),    icon: '✨', gradient: 'from-amber-400 to-orange-500' },
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
              className="home-hero-explore px-8 py-3.5 bg-white text-emerald-700 font-black rounded-2xl
                hover:bg-emerald-50 hover:scale-105 active:scale-95
                transition-all duration-200 shadow-xl text-base tracking-wide">
              {t('home_explore_btn')}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid grid-cols-3 gap-3 sm:gap-5">
            {statItems.map((s, i) => (
              <div key={i} className="text-center">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {QUICK_LINKS.map((ql, i) => (
              <button key={i}
                onClick={() => handleNavigate(ql.screen)}
                className={`relative overflow-hidden rounded-2xl p-5 text-white text-right
                  bg-gradient-to-br ${ql.gradient} shadow-md ${ql.shadow}
                  hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all duration-200
                  animate-card-in cursor-pointer`}
                style={{ animationDelay: `${i * 0.08}s`, cursor: 'pointer' }}>
                <div className="pointer-events-none absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10" />
                <p className="text-3xl mb-2">{ql.icon}</p>
                <p className="text-sm font-black leading-tight">{ql.label}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Community Perks */}
        <section>
          <div className="text-center mb-6">
            <h2 className="text-xl font-black text-gray-800 mb-1">{t('home_why_title')}</h2>
            <p className="text-sm text-gray-500">{t('home_why_subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COMMUNITY_PERKS.map((p, i) => (
              <div key={i}
                className={`community-perk ${p.bg} rounded-2xl p-5 border border-white/50
                  animate-card-in`}
                style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="flex items-start gap-3">
                  <span className="text-3xl shrink-0">{p.icon}</span>
                  <div>
                    <p className={`community-perk-title font-black text-sm mb-1 ${p.color}`}>{p.title}</p>
                    <p className="community-perk-description text-xs text-gray-500 leading-relaxed">{p.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        {currentUser?.role === 'User' ? (
          <section>
            <div className="home-welcome-card bg-gradient-to-l from-emerald-50 to-teal-50 border border-emerald-100
              rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-right">
                <p className="font-black text-gray-800 text-base">
                  {isAr ? `مرحباً، ${currentUser.name}! 👋` : `שלום, ${currentUser.name}! 👋`}
                </p>
                <p className="home-welcome-subtitle text-sm text-gray-500 mt-0.5">{t('home_welcome_subtitle')}</p>
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
            <div className="home-login-cta relative overflow-hidden
              rounded-2xl p-6 text-white">
              <div className="pointer-events-none absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 animate-blob" />
              <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
                <div>
                  <p className="font-black text-xl mb-1">{t('home_cta_title')}</p>
                  <p className="text-white/75 text-sm">{t('home_cta_subtitle')}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                  <button onClick={() => handleNavigate('register')}
                    className="px-7 py-3 bg-white/15 border border-white/40 text-white font-bold
                      rounded-xl transition-all hover:bg-white/25 hover:scale-105 active:scale-95
                      backdrop-blur-sm text-sm">
                    {t('home_cta_register_btn')}
                  </button>
                  <button onClick={() => handleNavigate('login')}
                    className="home-cta-login px-7 py-3 bg-white text-[#6c4e9b] font-black
                      rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg text-sm">
                    {t('home_cta_login_btn')}
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : null}

      </div>
    </div>
  );
}

export default HomePage;
