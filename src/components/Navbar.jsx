import { useState, useEffect, useRef } from 'react';
import { isStaffRole } from '../utils/permissions';

const PUBLIC_LINKS = [
  { screen: 'home',          labelHe: 'בית',        labelAr: 'الرئيسية',      icon: '🏠' },
  { screen: 'opportunities', labelHe: 'הזדמנויות',  labelAr: 'الفرص',         icon: '🔍' },
  { screen: 'calendar',      labelHe: 'לוח שנה',    labelAr: 'التقويم',       icon: '📅' },
  { screen: 'hot-this-week', labelHe: 'חם השבוע',   labelAr: 'الأكثر رواجاً', icon: '🔥' },
  { screen: 'gallery',       labelHe: 'גלריה',      labelAr: 'معرض',          icon: '📸' },
  { screen: 'about',         labelHe: 'אודות',      labelAr: 'معلومات',       icon: '📖' },
];

function Navbar({ theme, lang, currentUser, currentScreen, onToggleDark, onToggleLang, onNavigate, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const isAr = lang === 'ar';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const extraLinks = [
    ...(currentUser?.role === 'User'
      ? [{ screen: 'my-registrations', labelHe: 'ההרשמות שלי', labelAr: 'فرصي المسجلة', icon: '✅' }]
      : []),
    ...(isStaffRole(currentUser)
      ? [{ screen: 'admin', labelHe: 'ניהול', labelAr: 'إدارة', icon: '⚙️' }]
      : []),
  ];

  const allLinks = [...PUBLIC_LINKS, ...extraLinks];
  const isDark   = theme === 'dark';

  const NavBtn = ({ link }) => {
    const active = currentScreen === link.screen;
    const isAdmin = link.screen === 'admin';
    return (
      <button
        onClick={() => { onNavigate(link.screen); setMenuOpen(false); }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150
          ${active
            ? isAdmin
              ? 'bg-violet-600 text-white shadow-md'
              : 'bg-gradient-to-l from-emerald-500 to-teal-500 text-white shadow-md nav-glow'
            : isDark
              ? 'text-gray-300 hover:bg-slate-700/70 hover:text-white'
              : isAdmin
                ? 'text-violet-600 hover:bg-violet-50'
                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'}`}>
        <span className="text-sm">{link.icon}</span>
        <span className="hidden lg:inline">{isAr ? link.labelAr : link.labelHe}</span>
      </button>
    );
  };

  return (
    <div ref={navRef} className="fixed top-0 right-0 left-0 z-50 px-3 pt-3">
      <nav className={`max-w-6xl mx-auto transition-all duration-300 rounded-2xl border
        ${isDark
          ? 'bg-slate-900/95 border-slate-700/60 text-white'
          : 'bg-white/95 border-gray-100/80 text-gray-900'}
        backdrop-blur-xl
        ${scrolled ? 'shadow-xl shadow-black/10' : 'shadow-lg shadow-black/5'}`}>

        <div className="flex items-center justify-between px-4 py-2.5 gap-3">

          {/* ── Logo + Brand ── */}
          <button
            onClick={() => { onNavigate('home'); setMenuOpen(false); }}
            className="flex items-center gap-2.5 shrink-0 group text-right">
            <img
              src="https://bkerem.org.il/wp-content/uploads/2023/01/Logo.jpg"
              alt="לוגו"
              className="h-9 w-auto object-contain rounded-xl shrink-0
                ring-2 ring-transparent group-hover:ring-emerald-300 transition-all duration-200"
            />
            <div className="hidden sm:block">
              <p className={`text-sm font-black leading-none ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {isAr ? 'عنقود بيت هكيريم' : 'אשכול בית הכרם'}
              </p>
              <p className="text-[10px] text-emerald-500 font-semibold mt-0.5 leading-none">
                {isAr ? 'منصة الشباب' : 'פלטפורמת הנוער'}
              </p>
            </div>
          </button>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {PUBLIC_LINKS.map(link => <NavBtn key={link.screen} link={link} />)}
            {extraLinks.map(link => <NavBtn key={link.screen} link={link} />)}
          </div>

          {/* ── Action Buttons ── */}
          <div className="flex items-center gap-1.5 shrink-0">

            {/* Language */}
            <button onClick={onToggleLang}
              className={`h-8 w-8 flex items-center justify-center text-xs font-black rounded-xl border-2 transition-all duration-150
                ${isDark
                  ? 'border-emerald-500 text-emerald-400 hover:bg-slate-700'
                  : 'border-emerald-500 text-emerald-700 hover:bg-emerald-50'}`}>
              {isAr ? 'ע' : 'ع'}
            </button>

            {/* Dark mode */}
            <button onClick={onToggleDark}
              className={`h-8 w-8 flex items-center justify-center text-base rounded-xl transition-all duration-150
                ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* User / Login */}
            {currentUser ? (
              <div className="hidden md:flex items-center gap-1.5">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl
                  ${isDark ? 'bg-slate-700' : 'bg-emerald-50'}`}>
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500
                    flex items-center justify-center text-white text-xs font-black shrink-0">
                    {currentUser.name?.[0] ?? '?'}
                  </div>
                  <span className={`text-xs font-semibold max-w-[72px] truncate
                    ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    {currentUser.name}
                  </span>
                </div>
                <button onClick={onLogout}
                  className="h-8 px-2.5 text-xs font-semibold border border-red-200 text-red-500
                    rounded-xl hover:bg-red-50 transition-all duration-150">
                  {isAr ? 'خروج' : 'יציאה'}
                </button>
              </div>
            ) : (
              <button onClick={() => onNavigate('login')}
                className="h-8 px-4 bg-gradient-to-l from-emerald-600 to-teal-500
                  hover:from-emerald-700 hover:to-teal-600 text-white text-xs font-black
                  rounded-xl transition-all duration-150 shadow-md hover:shadow-emerald-200
                  hover:scale-105 active:scale-95">
                {isAr ? 'دخول' : 'כניסה →'}
              </button>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className={`md:hidden h-8 w-8 flex items-center justify-center rounded-xl transition-all duration-150
                ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
              <span className="text-base font-bold">{menuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {menuOpen && (
          <div className={`md:hidden border-t px-3 py-3 flex flex-col gap-1 animate-fade-in
            ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>

            {currentUser && (
              <div className={`flex items-center gap-2.5 px-3 py-2.5 mb-2 rounded-xl
                ${isDark ? 'bg-slate-800' : 'bg-gradient-to-l from-emerald-50 to-teal-50'}`}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500
                  flex items-center justify-center text-white text-sm font-black shrink-0">
                  {currentUser.name?.[0] ?? '?'}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-black truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-emerald-600 font-semibold">{currentUser.role}</p>
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
                        ? 'bg-violet-600 text-white'
                        : 'bg-gradient-to-l from-emerald-500 to-teal-500 text-white shadow-md'
                      : isDark
                        ? 'text-gray-200 hover:bg-slate-800'
                        : isAdmin
                          ? 'text-violet-700 hover:bg-violet-50'
                          : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'}`}>
                  <span className="text-base">{link.icon}</span>
                  <span>{isAr ? link.labelAr : link.labelHe}</span>
                </button>
              );
            })}

            {currentUser && (
              <button
                onClick={() => { onLogout(); setMenuOpen(false); }}
                className="flex items-center gap-2.5 py-2.5 px-4 rounded-xl text-sm font-semibold
                  min-h-[44px] text-red-600 border border-red-100 hover:bg-red-50 transition-all mt-1">
                <span className="text-base">🚪</span>
                <span>{isAr ? 'خروج' : 'יציאה'}</span>
              </button>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
