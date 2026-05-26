import { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import OpportunitiesBoard from './components/OpportunitiesBoard';
import { INITIAL_OPPORTUNITIES } from './data/fakeData';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [currentUser,   setCurrentUser]   = useState(null);
  const [theme,         setTheme]         = useState('');
  const [lang,          setLang]          = useState('he');
  const [selectedOpp,   setSelectedOpp]   = useState(null);

  const isAr = lang === 'ar';

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentScreen(user.role === 'Admin' ? 'admin' : 'opportunities');
  };

  const handleLogout = () => { setCurrentUser(null); setCurrentScreen('home'); };

  const handleNavigate = (screen) => {
    if (screen === 'admin' && currentUser?.role !== 'Admin') {
      setCurrentScreen('login'); return;
    }
    setCurrentScreen(screen);
  };

  return (
    <div dir="rtl" className={`min-h-screen font-sans
      ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>

      <Navbar
        theme={theme} lang={lang} currentUser={currentUser}
        onToggleDark={() => setTheme(p => p === 'dark' ? '' : 'dark')}
        onToggleLang={() => setLang(p => p === 'he' ? 'ar' : 'he')}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <main className="pt-16">

        {currentScreen === 'home' && (
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <div className="bg-gradient-to-bl from-emerald-800 to-emerald-500
              text-white py-20 px-6 rounded-3xl mb-10 shadow-xl">
              <h1 className="text-4xl font-black mb-3">
                {isAr ? 'مركز الفرص' : 'מרכז ההזדמנויות'}
              </h1>
              <p className="text-emerald-100 mb-8 text-lg">
                {isAr
                  ? 'جميع الفرص لشباب عنقود بيت هكيريم — في مكان واحد'
                  : 'כל ההזדמנויות לבני הנוער של אשכול בית הכרם — במקום אחד'}
              </p>
              <button onClick={() => handleNavigate('opportunities')}
                className="px-8 py-3 bg-white text-emerald-700 font-bold
                  rounded-xl hover:bg-emerald-50 transition shadow-lg text-lg">
                {isAr ? 'استكشف الفرص ←' : '← גלה הזדמנויות'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { num: INITIAL_OPPORTUNITIES.length, labelHe: 'הזדמנויות', labelAr: 'فرصة' },
                { num: 10, labelHe: 'רשויות',  labelAr: 'بلدية' },
                { num: 6,  labelHe: 'קטגוריות', labelAr: 'فئة'  },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <p className="text-3xl font-black text-emerald-700">{s.num}</p>
                  <p className="text-sm text-gray-500">{isAr ? s.labelAr : s.labelHe}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentScreen === 'login' && (
          <Login lang={lang} onLogin={handleLogin} onNavigate={handleNavigate} />
        )}

        {currentScreen === 'opportunities' && (
          <OpportunitiesBoard
            opportunities={INITIAL_OPPORTUNITIES}
            lang={lang}
            onOpenModal={setSelectedOpp}
          />
        )}

        {currentScreen === 'admin' && currentUser?.role === 'Admin' && (
          <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-black text-gray-800 mb-2">
              {isAr ? '⚙️ لوحة الإدارة' : '⚙️ ממשק ניהול'}
            </h1>
            <p className="text-gray-500">
              {isAr ? `مرحباً ${currentUser.name}` : `שלום ${currentUser.name}`}
            </p>
          </div>
        )}
      </main>

      {selectedOpp && (
        <div onClick={() => setSelectedOpp(null)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedOpp(null)}
              className="float-left text-gray-400 hover:text-gray-700 text-2xl leading-none">✕</button>
            <div className="text-center mb-5 clear-both">
              <span className="text-5xl">{selectedOpp.icon}</span>
              <h2 className="text-xl font-black text-gray-800 mt-2">
                {isAr ? selectedOpp.titleAr : selectedOpp.title}
              </h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-5">
              {isAr && selectedOpp.descriptionAr ? selectedOpp.descriptionAr : selectedOpp.description}
            </p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { labelHe:'📍 יישוב',   labelAr:'📍 البلدة',      val: selectedOpp.city },
                { labelHe:'🎂 גיל',     labelAr:'🎂 العمر',       val: `${selectedOpp.ageMin}–${selectedOpp.ageMax}` },
                { labelHe:'📅 ימים',    labelAr:'📅 الأيام',      val: isAr && selectedOpp.daysAr ? selectedOpp.daysAr : selectedOpp.days },
                { labelHe:'🕐 שעות',    labelAr:'🕐 الوقت',       val: selectedOpp.time },
                { labelHe:'👤 איש קשר', labelAr:'👤 جهة الاتصال', val: selectedOpp.contact },
                { labelHe:'📝 הרשמה',  labelAr:'📝 التسجيل',    val: isAr && selectedOpp.registrationAr ? selectedOpp.registrationAr : selectedOpp.registration },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">{isAr ? item.labelAr : item.labelHe}</p>
                  <p className="text-sm font-medium text-gray-800">{item.val}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setSelectedOpp(null)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700
                text-white font-bold rounded-xl transition">
              {isAr ? 'سجل الآن' : 'הרשמה לפעילות'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;