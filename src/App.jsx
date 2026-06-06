import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import OpportunitiesBoard from './components/OpportunitiesBoard';
import StaffPanel from './components/staff/StaffPanel';
import EventsCalendar from './components/calendar/EventsCalendar';
import OpportunityDetailModal from './components/OpportunityDetailModal';
import MyRegistrations from './components/MyRegistrations';
import RegistrationModal from './components/RegistrationModal';

import { useDataStore } from './hooks/useDataStore';
import { loadSession, saveSession } from './hooks/useLocalStore';

import { ORGANIZATIONS } from './data/organizations';

import { setDocumentLang, pick } from './lib/i18n/i18n'; 
import { isStaffRole } from './lib/utils/permissions';

function App() {
  const store = useDataStore();
  const [currentScreen, setCurrentScreen] = useState('home');
  const [currentUser, setCurrentUser] = useState(() => loadSession());
  const [theme, setTheme] = useState('');
  const [lang, setLang] = useState('he');
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [showRegModal, setShowRegModal] = useState(false);
  const [toast, setToast] = useState('');

  const isAr = lang === 'ar';

  useEffect(() => setDocumentLang(lang), [lang]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    saveSession(user);
    setCurrentScreen(isStaffRole(user) ? 'admin' : 'opportunities');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveSession(null);
    setCurrentScreen('home');
  };

  const handleNavigate = (screen) => {
    if (screen === 'admin' && !isStaffRole(currentUser)) {
      setCurrentScreen('login');
      return;
    }
    if (screen === 'my-registrations') {
      if (!currentUser || currentUser.role !== 'User') {
        setCurrentScreen('login');
        showToast(pick(isAr, 'יש להתחבר כמשתמש נוער', 'يجب تسجيل الدخول كشاب'));
        return;
      }
    }
    setCurrentScreen(screen);
  };

  const openOppModal = (opp) => {
    setSelectedOpp(opp);
    store.recordView(opp.id, currentUser?.id);
  };

  const handleRegisterClick = () => {
    if (!currentUser) {
      setSelectedOpp(null);
      setCurrentScreen('login');
      showToast(pick(isAr, 'יש להתחבר כדי להירשם', 'يجب تسجيل الدخول للتسجيل'));
      return;
    }
    if (currentUser.role !== 'User') {
      showToast(pick(isAr, 'הרשמה זמינה למשתמשי נוער בלבד', 'التسجيل للشباب فقط'));
      return;
    }
    setShowRegModal(true);
  };

  const handleRegisterConfirm = async (profilePatch) => {
    try {
      const result = await store.register(currentUser.id, selectedOpp.id, profilePatch);
      setShowRegModal(false);
      if (result.ok) {
        showToast(pick(isAr, 'נרשמת בהצלחה!', 'تم التسجيل بنجاح!'));
      } else if (result.reason === 'duplicate') {
        showToast(pick(isAr, 'כבר נרשמת לפעילות זו', 'مسجل بالفعل'));
      }
    } catch {
      showToast(pick(isAr, 'שגיאה בהרשמה, נסה שוב', 'خطأ في التسجيل، حاول مرة أخرى'));
    }
  };

  const handleCancelRegistration = async (opportunityId) => {
    if (!currentUser || currentUser.role !== 'User') return;
    const oppId = opportunityId ?? selectedOpp?.id;
    if (!oppId) return;
    try {
      const result = await store.unregister(currentUser.id, oppId);
      if (result.ok) {
        showToast(pick(isAr, 'ההרשמה בוטלה', 'تم إلغاء التسجيل'));
        if (selectedOpp?.id === oppId) setSelectedOpp(null);
      }
    } catch {
      showToast(pick(isAr, 'שגיאה בביטול ההרשמה', 'خطأ في إلغاء التسجيل'));
    }
  };

  if (store.ready === false) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
        {isAr ? 'جاري التحميل...' : 'טוען נתונים...'}
      </div>
    );
  }

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

      {toast && (
        <div className="fixed top-20 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:max-w-sm z-[70] bg-emerald-700 text-white px-4 py-2 rounded-xl shadow-lg text-sm text-center">
          {toast}
        </div>
      )}

      <main className="pt-14 sm:pt-16">

        {currentScreen === 'home' && (
          <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20 text-center">
            <div className="bg-gradient-to-bl from-emerald-800 to-emerald-500
              text-white py-12 sm:py-20 px-4 sm:px-6 rounded-3xl mb-10 shadow-xl">
              <h1 className="text-2xl sm:text-4xl font-black mb-3">
                {isAr ? 'مركز الفرص' : 'מרכז ההזדמנויות'}
              </h1>
              <p className="text-emerald-100 mb-8 text-lg">
                {isAr
                  ? 'جميع الفرص لشباب عنقود بيت هكيريم — في مكان واحد'
                  : 'כל ההזדמנויות לבני הנוער של אשכול בית הכרם — במקום אחד'}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button onClick={() => handleNavigate('opportunities')}
                  className="px-8 py-3 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition shadow-lg text-lg">
                  {isAr ? 'استكشف الفرص' : 'גלה הזדמנויות'}
                </button>
                <button onClick={() => handleNavigate('calendar')}
                  className="px-8 py-3 bg-emerald-900/40 text-white font-bold rounded-xl hover:bg-emerald-900/60 transition border border-white/30 text-lg">
                  {isAr ? 'التقويم' : 'לוח אירועים'}
                </button>
              </div>
            </div>

            {/* Mobile: stack stats; sm+: three columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { num: store.opportunities.length, labelHe: 'הזדמנויות', labelAr: 'فرصة' },
                { num: ORGANIZATIONS.length, labelHe: 'ארגונים', labelAr: 'جهة' },
                { num: 6, labelHe: 'קטגוריות', labelAr: 'فئة' },
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
            opportunities={store.opportunities}
            lang={lang}
            onOpenModal={openOppModal}
          />
        )}

        {currentScreen === 'calendar' && (
          <EventsCalendar
            events={store.events}
            lang={lang}
            opportunities={store.opportunities}
            onOpenOpp={openOppModal}
          />
        )}

        {currentScreen === 'my-registrations' && currentUser?.role === 'User' && (
          <MyRegistrations
            lang={lang}
            currentUser={currentUser}
            opportunities={store.opportunities}
            registrations={store.registrations}
            onOpenModal={openOppModal}
            onCancel={handleCancelRegistration}
          />
        )}

        {currentScreen === 'admin' && isStaffRole(currentUser) && (
          <StaffPanel
            lang={lang}
            currentUser={currentUser}
            opportunities={store.opportunities}
            events={store.events}
            views={store.views}
            registrations={store.registrations}
            cancellations={store.cancellations}
            profiles={store.profiles}
            onAdd={store.addOpportunity}
            onUpdate={store.updateOpportunity}
            onDelete={store.deleteOpportunity}
            onAddEvent={store.addEvent}
            onDeleteEvent={store.deleteEvent}
            onReplaceEventsForOpportunity={store.replaceEventsForOpportunity}
          />
        )}
      </main>

      {selectedOpp && !showRegModal && (
        <OpportunityDetailModal
          opportunity={selectedOpp}
          lang={lang}
          isRegistered={currentUser?.role === 'User' && store.isRegistered(currentUser.id, selectedOpp.id)}
          onClose={() => setSelectedOpp(null)}
          onRegisterClick={handleRegisterClick}
          onCancelRegistration={
            currentUser?.role === 'User' && store.isRegistered(currentUser.id, selectedOpp.id)
              ? () => handleCancelRegistration(selectedOpp.id)
              : null
          }
        />
      )}

      {showRegModal && selectedOpp && currentUser && (
        <RegistrationModal
          opportunity={selectedOpp}
          lang={lang}
          profile={store.getProfile(currentUser.id)}
          onConfirm={handleRegisterConfirm}
          onClose={() => setShowRegModal(false)}
        />
      )}
    </div>
  );
}

export default App;
