// File: src/components/Navbar.jsx
// Purpose: Navbar component
// Role: React component for Navbar

import { useState, useEffect, useRef } from 'react';
import { isStaffRole } from '../../utils/permissions';
import { useT } from '../../i18n/i18n';

const PUBLIC_LINKS = [
  { screen: 'home',          key: 'nav_home',          icon: '🏠' },
  { screen: 'opportunities', key: 'nav_opportunities',  icon: '🔍' },
  { screen: 'calendar',      key: 'nav_calendar',       icon: '📅' },
  { screen: 'gallery',       key: 'nav_gallery',        icon: '📸' },
];

// Navbar — renders Navbar
function Navbar({ theme, lang, currentUser, currentScreen, onToggleDark, onToggleLang, onNavigate, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const t = useT(lang);

  useEffect(() => {
    // onScroll — handles onScroll
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    // handleClick — handles Click
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const extraLinks = [
    ...(currentUser?.role === 'User'
      ? [{ screen: 'my-registrations', key: 'nav_my_registrations', icon: '✅' }]
      : []),
    ...(isStaffRole(currentUser)
      ? [{ screen: 'admin', key: 'nav_admin', icon: '⚙️' }]
      : []),
  ];

  const allLinks = [...PUBLIC_LINKS, ...extraLinks];
  const isDark   = theme === 'dark';

  // NavBtn — renders NavBtn
  const NavBtn = ({ link }) => {
    const active = currentScreen === link.screen;
    const isAdmin = link.screen === 'admin';
    return (
      <button
        onClick={() => { onNavigate(link.screen); setMenuOpen(false); }}
        aria-label={t(link.key)}
        title={t(link.key)}
        className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap px-2.5 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all duration-150
          ${active
            ? isAdmin
              ? 'bg-sky-700 text-white shadow-sm shadow-slate-950/10'
              : 'bg-[#037c57] text-white'
            : isDark
              ? 'text-gray-300 hover:bg-slate-700/70 hover:text-white'
              : isAdmin
                ? 'text-sky-700 hover:bg-sky-50 hover:text-sky-800'
                : 'text-gray-600 hover:bg-[#edf2ef] hover:text-[#037c57]'}`}>
        <span className="text-sm">{link.icon}</span>
        <span className="hidden xl:inline">{t(link.key)}</span>
      </button>
    );
  };

  return (
    <div ref={navRef} className="fixed top-0 right-0 left-0 z-50 px-3 pt-3">
      <nav className={`max-w-[1440px] mx-auto transition-all duration-300 rounded-2xl border
        ${isDark
          ? 'bg-slate-900/95 border-slate-700/60 text-white'
          : 'bg-white/95 border-gray-100/80 text-gray-900'}
        backdrop-blur-xl
        ${scrolled ? 'shadow-xl shadow-black/10' : 'shadow-lg shadow-black/5'}`}>

        <div className="flex min-h-[70px] items-center justify-between gap-1.5 px-2 py-2.5 sm:gap-3 sm:px-4">

          <button
            onClick={() => { onNavigate('home'); setMenuOpen(false); }}
            className="flex min-w-0 shrink-0 items-center gap-1.5 text-right group sm:gap-2.5">
            <img
              src="/eshkol-logo.png"
              alt={t('brand_logo_alt')}
              className="h-8 w-auto shrink-0 rounded-xl object-contain sm:h-9
                ring-2 ring-transparent group-hover:ring-[#8ca397] transition-all duration-200"
            />
            <div className="block min-w-0">
              <p className={`whitespace-nowrap text-[13px] font-black leading-none sm:text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {t('nav_brand_title')}
              </p>
              <p className="mt-0.5 whitespace-nowrap text-[10px] font-semibold leading-none text-[#037c57] sm:text-[12px]">
                {t('nav_brand_subtitle')}
              </p>
            </div>
          </button>

          <div className="hidden md:flex min-w-0 flex-1 items-center justify-center gap-0.5 overflow-x-auto scrollbar-hide py-0.5">
            {PUBLIC_LINKS.map(link => <NavBtn key={link.screen} link={link} />)}
            {extraLinks.map(link => <NavBtn key={link.screen} link={link} />)}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">

            <button onClick={onToggleLang}
              className={`h-8 w-8 flex items-center justify-center text-sm font-black rounded-xl border-2 transition-all duration-150
                ${isDark
                  ? 'border-[#8ca397] text-[#a9c2b7] hover:bg-slate-700'
                  : 'border-[#037c57] text-[#037c57] hover:bg-[#edf2ef]'}`}>
              {t('nav_lang_toggle')}
            </button>

            <button onClick={onToggleDark}
              className={`h-8 w-8 flex items-center justify-center text-base rounded-xl transition-all duration-150
                ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
              {isDark ? '☀️' : '🌙'}
            </button>

            {currentUser ? (
              <div className="hidden md:flex items-center gap-1.5">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl
                  ${isDark ? 'bg-slate-700' : 'bg-[#edf2ef]'}`}>
                  <div className="w-5 h-5 rounded-full bg-[#037c57]
                    flex items-center justify-center text-white text-xs font-black shrink-0">
                    {currentUser.name?.[0] ?? '?'}
                  </div>
                  <span className={`text-sm font-semibold max-w-[72px] truncate
                    ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    {currentUser.name}
                  </span>
                </div>
                <button onClick={onLogout}
                  className="h-8 px-2.5 text-sm font-semibold border border-red-200 text-red-500
                    rounded-xl hover:bg-red-50 transition-all duration-150">
                  {t('nav_logout')}
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-1.5">
                <button onClick={() => onNavigate('register')}
                  className={`h-8 px-3 text-sm font-bold rounded-xl border-2 transition-all duration-150
                    hover:scale-105 active:scale-95
                    ${isDark
                      ? 'border-[#8ca397] text-[#a9c2b7] hover:bg-slate-700'
                      : 'border-[#037c57] text-[#037c57] hover:bg-[#edf2ef]'}`}>
                  {t('nav_register_btn')}
                </button>
                <button onClick={() => onNavigate('login')}
                  className="h-8 px-4 bg-[#037c57] hover:bg-[#026647] text-white text-sm font-black
                    rounded-xl transition-all duration-150 shadow-md hover:shadow-[#037c57]/25
                    hover:scale-105 active:scale-95">
                  {t('nav_login_btn')}
                </button>
              </div>
            )}

            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className={`md:hidden h-8 w-8 flex items-center justify-center rounded-xl transition-all duration-150
                ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
              <span className="text-base font-bold">{menuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className={`md:hidden border-t px-3 py-3 flex flex-col gap-1 animate-fade-in
            ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>

            {currentUser && (
              <div className={`flex items-center gap-2.5 px-3 py-2.5 mb-2 rounded-xl
                ${isDark ? 'bg-slate-800' : 'bg-[#edf2ef]'}`}>
                <div className="w-8 h-8 rounded-full bg-[#037c57]
                  flex items-center justify-center text-white text-sm font-black shrink-0">
                  {currentUser.name?.[0] ?? '?'}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-black truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {currentUser.name}
                  </p>
                  <p className={`text-xs font-semibold ${isDark ? 'text-[#a9c2b7]' : 'text-[#037c57]'}`}>
                    {t(`role_${currentUser.role.toLowerCase()}`)}
                  </p>
                </div>
              </div>
            )}

            {allLinks.map(link => {
              const active  = currentScreen === link.screen;
              const isAdmin = link.screen === 'admin';
              return (
                <button key={link.screen}
                  onClick={() => { onNavigate(link.screen); setMenuOpen(false); }}
                  className={`flex items-center gap-2.5 py-2.5 px-4 rounded-xl text-sm font-semibold
                    min-h-[44px] transition-all duration-150
                    ${active
                      ? isAdmin
                        ? 'bg-sky-700 text-white'
                        : 'bg-[#037c57] text-white'
                      : isDark
                        ? 'text-gray-200 hover:bg-slate-800'
                        : isAdmin
                          ? 'text-sky-700 hover:bg-sky-50 hover:text-sky-800'
                          : 'text-gray-700 hover:bg-[#edf2ef] hover:text-[#037c57]'}`}>
                  <span className="text-base">{link.icon}</span>
                  <span>{t(link.key)}</span>
                </button>
              );
            })}

            {currentUser ? (
              <button
                onClick={() => { onLogout(); setMenuOpen(false); }}
                className="flex items-center gap-2.5 py-2.5 px-4 rounded-xl text-sm font-semibold
                  min-h-[44px] text-red-600 border border-red-100 hover:bg-red-50 transition-all mt-1">
                <span className="text-base">🚪</span>
                <span>{t('nav_logout')}</span>
              </button>
            ) : (
              <div className="flex flex-col gap-2 mt-1">
                <button
                  onClick={() => { onNavigate('register'); setMenuOpen(false); }}
                  className={`flex items-center gap-2.5 py-2.5 px-4 rounded-xl text-sm font-bold
                    min-h-[44px] border-2 transition-all
                    ${isDark
                      ? 'border-[#8ca397] text-[#a9c2b7]'
                      : 'border-[#037c57] text-[#037c57] hover:bg-[#edf2ef]'}`}>
                  <span className="text-base">✍️</span>
                  <span>{t('nav_register_btn')}</span>
                </button>
                <button
                  onClick={() => { onNavigate('login'); setMenuOpen(false); }}
                  className="flex items-center gap-2.5 py-2.5 px-4 rounded-xl text-sm font-black
                    min-h-[44px] bg-[#037c57] hover:bg-[#026647] text-white
                    shadow-md transition-all">
                  <span className="text-base">🔑</span>
                  <span>{t('nav_login_btn')}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
