import { useState } from 'react';

function Navbar({ theme, lang, currentUser, onToggleDark, onToggleLang, onNavigate, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isAr = lang === 'ar';

  const navLinks = [
    { screen: 'home',          labelHe: '🏠 בית',       labelAr: '🏠 الرئيسية' },
    { screen: 'opportunities', labelHe: '🔍 הזדמנויות', labelAr: '🔍 الفرص'    },
    ...(currentUser?.role === 'Admin'
      ? [{ screen: 'admin', labelHe: '⚙️ ניהול', labelAr: '⚙️ إدارة' }]
      : []),
  ];

  return (
    <nav className="fixed top-0 right-0 left-0 z-40 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-2">

        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
          <img
            src="https://bkerem.org.il/wp-content/uploads/2023/01/Logo.jpg"
            alt="לוגו" className="h-11 w-auto object-contain rounded-md"
          />
          <div className="hidden md:block leading-tight">
            <p className="text-xs text-gray-400">אשכול בית הכרם</p>
            <p className="text-sm font-bold text-emerald-700">
              {isAr ? 'مركز الفرص' : 'מרכז ההזדמנויות'}
            </p>
          </div>
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

        <div className="flex items-center gap-2">
          <button onClick={onToggleLang}
            className="px-2.5 py-1.5 text-xs font-bold border-2 border-emerald-600
              text-emerald-700 rounded-lg hover:bg-emerald-50 transition min-w-[44px]">
            {isAr ? 'עברית' : 'عربي'}
          </button>

          <button onClick={onToggleDark}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-sm font-medium text-gray-700">
                {isAr ? 'أهلاً،' : 'שלום,'} {currentUser.name}
              </span>
              <button onClick={onLogout}
                className="px-3 py-1.5 text-xs border border-red-300
                  text-red-600 rounded-lg hover:bg-red-50 transition">
                {isAr ? 'خروج' : 'יציאה'}
              </button>
            </div>
          ) : (
            <button onClick={() => onNavigate('login')}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700
                text-white text-sm font-medium rounded-lg transition">
              {isAr ? 'دخول' : 'כניסה'}
            </button>
          )}

          <button onClick={() => setMenuOpen(prev => !prev)}
            className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-2">
          {navLinks.map(link => (
            <button key={link.screen}
              onClick={() => { onNavigate(link.screen); setMenuOpen(false); }}
              className="text-right py-2 px-3 rounded-lg text-sm font-medium
                text-gray-700 hover:bg-emerald-50 transition">
              {isAr ? link.labelAr : link.labelHe}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;