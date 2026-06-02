import { useState, useEffect, useRef } from 'react';
import { isStaffRole } from '../lib/permissions';

function Navbar({ theme, lang, currentUser, onToggleDark, onToggleLang, onNavigate, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const isAr = lang === 'ar';

  const navLinks = [
    { screen: 'home',          labelHe: '🏠 בית',       labelAr: '🏠 الرئيسية' },
    { screen: 'opportunities', labelHe: '🔍 הזדמנויות', labelAr: '🔍 الفرص'    },
    { screen: 'calendar',      labelHe: '📅 לוח שנה',   labelAr: '📅 التقويم'   },
    ...(currentUser?.role === 'User'
      ? [{ screen: 'my-registrations', labelHe: '✅ הזדמנויות שנרשמתי', labelAr: '✅ فرصي المسجلة' }]
      : []),
    ...(isStaffRole(currentUser)
      ? [{ screen: 'admin', labelHe: '⚙️ ניהול', labelAr: '⚙️ إدارة' }]
      : []),
  ];

  // Close mobile menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const touchBtn = 'min-h-[44px] min-w-[44px] flex items-center justify-center';

  const handleLogout = () => {
    setMenuOpen(false);
    onLogout();
  };

  return (
    <nav ref={navRef} className="fixed top-0 right-0 left-0 z-40 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-2">

        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0 flex-1" onClick={() => onNavigate('home')}>
          <img
            src="https://bkerem.org.il/wp-content/uploads/2023/01/Logo.jpg"
            alt="לוגו" className="h-10 sm:h-11 w-auto object-contain rounded-md shrink-0"
          />
          {/* Logged-in user name in top bar (replaces site title) */}
          {currentUser && (
            <p className="text-sm font-bold text-gray-800 truncate">
              {currentUser.name}
            </p>
          )}
        </div>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <button key={link.screen} onClick={() => onNavigate(link.screen)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600
                hover:bg-emerald-50 hover:text-emerald-700 transition">
              {isAr ? link.labelAr : link.labelHe}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button onClick={onToggleLang}
            className={`${touchBtn} px-2.5 text-xs font-bold border-2 border-emerald-600
              text-emerald-700 rounded-lg hover:bg-emerald-50 transition`}>
            {isAr ? 'עברית' : 'عربي'}
          </button>

          <button onClick={onToggleDark}
            className={`${touchBtn} rounded-lg bg-gray-100 hover:bg-gray-200 transition`}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {currentUser ? (
            <button onClick={onLogout}
              className={`hidden md:flex ${touchBtn} px-3 text-xs border border-red-300
                text-red-600 rounded-lg hover:bg-red-50 transition`}>
              {isAr ? 'خروج' : 'יציאה'}
            </button>
          ) : (
            <button onClick={() => onNavigate('login')}
              className={`${touchBtn} px-4 bg-emerald-600 hover:bg-emerald-700
                text-white text-sm font-medium rounded-lg transition`}>
              {isAr ? 'دخول' : 'כניסה'}
            </button>
          )}

          <button onClick={() => setMenuOpen(prev => !prev)}
            className={`md:hidden ${touchBtn} rounded-lg bg-gray-100 hover:bg-gray-200 transition`}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-2">
          {navLinks.map(link => (
            <button key={link.screen}
              onClick={() => { onNavigate(link.screen); setMenuOpen(false); }}
              className="text-right py-3 px-3 rounded-lg text-sm font-medium min-h-[44px]
                text-gray-700 hover:bg-emerald-50 transition">
              {isAr ? link.labelAr : link.labelHe}
            </button>
          ))}
          {currentUser && (
            <button onClick={handleLogout}
              className="text-right py-3 px-3 rounded-lg text-sm font-medium min-h-[44px]
                text-red-600 border border-red-200 hover:bg-red-50 transition mt-1">
              {isAr ? 'خروج' : 'יציאה'}
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
