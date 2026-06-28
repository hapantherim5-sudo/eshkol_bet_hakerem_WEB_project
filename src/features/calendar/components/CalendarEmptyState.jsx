export default function CalendarEmptyState({ currentUser, onNavigate, t }) {
  const loggedIn = Boolean(currentUser);
  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col animate-fade-in">
      <div className="relative overflow-hidden bg-gradient-to-bl from-emerald-700 via-emerald-600 to-teal-500 px-4 py-12 text-center text-white sm:py-16">
        <div className="relative"><p className="mb-4 text-5xl">📅</p><h1 className="mb-2 text-2xl font-black sm:text-3xl">{loggedIn ? t('calendar_personal_title', { name: currentUser.name }) : t('calendar_my_title')}</h1><p className="mx-auto max-w-xs text-sm leading-relaxed text-emerald-100">{t('calendar_hero_subtitle')}</p></div>
      </div>
      <div className="calendar-empty-content flex flex-1 items-center justify-center bg-gradient-to-b from-emerald-50/40 to-white px-4 py-14">
        <div className="w-full max-w-sm text-center"><p className="mb-5 text-7xl">{loggedIn ? '🌱' : '🔐'}</p><h2 className="mb-3 text-2xl font-black text-gray-800">{t(loggedIn ? 'calendar_empty_title' : 'calendar_login_title')}</h2>{loggedIn && <p className="mb-2 font-semibold text-gray-600">{t('calendar_empty_encouragement')}</p>}<p className="mx-auto mb-8 max-w-xs text-sm leading-relaxed text-gray-500">{t(loggedIn ? 'calendar_empty_description' : 'calendar_login_description')}</p><button onClick={() => onNavigate?.(loggedIn ? 'opportunities' : 'login')} className="rounded-2xl bg-gradient-to-l from-emerald-600 to-teal-500 px-8 py-4 text-base font-black text-white shadow-lg transition hover:scale-105">{loggedIn ? `🔍 ${t('calendar_explore')}` : `🔑 ${t('calendar_login_button')}`}</button></div>
      </div>
    </div>
  );
}
