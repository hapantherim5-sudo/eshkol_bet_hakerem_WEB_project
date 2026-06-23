import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StaffPanel from './components/staff/StaffPanel';
import EventsCalendar from './components/calendar/EventsCalendar';
import OpportunityDetailModal from './components/OpportunityDetailModal';
import RegistrationModal from './components/RegistrationModal';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OpportunitiesBoardPage from './pages/OpportunitiesBoardPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import AboutPage from './pages/AboutPage';
import GalleryPage from './pages/GalleryPage';
import HotThisWeekPage from './pages/HotThisWeekPage';

import { useDataStore } from './hooks/useDataStore';
import { loadSession, saveSession } from './hooks/useLocalStore';

import { setDocumentLang, useT } from './i18n/i18n';
import { isStaffRole } from './utils/permissions';

function App() {
  const store = useDataStore();
  const [currentScreen, setCurrentScreen] = useState('home');
  const [currentUser, setCurrentUser] = useState(() => loadSession());
  const [theme, setTheme] = useState('');
  const [lang, setLang] = useState('he');
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [showRegModal, setShowRegModal] = useState(false);
  const [toast,     setToast    ] = useState('');
  const [toastType, setToastType] = useState('success');

  const t = useT(lang);

  useEffect(() => setDocumentLang(lang), [lang]);

  const showToast = (msg, type = 'success') => {
    setToast(msg);
    setToastType(type);
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
        showToast(t('toast_youth_login'));
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
      showToast(t('toast_login_required'));
      return;
    }
    if (currentUser.role !== 'User') {
      showToast(t('toast_staff_only'));
      return;
    }
    setShowRegModal(true);
  };

  const handleRegisterConfirm = async (profilePatch) => {
    try {
      const result = await store.register(currentUser.id, selectedOpp.id, profilePatch);
      setShowRegModal(false);
      if (result.ok) {
        showToast(t('toast_registered'));
      } else if (result.reason === 'duplicate') {
        showToast(t('toast_already_reg'));
      }
    } catch {
      showToast(t('toast_reg_error'), 'error');
    }
  };

  const handleCancelRegistration = async (opportunityId) => {
    if (!currentUser || currentUser.role !== 'User') return;
    const oppId = opportunityId ?? selectedOpp?.id;
    if (!oppId) return;
    try {
      const result = await store.unregister(currentUser.id, oppId);
      if (result.ok) {
        showToast(t('toast_unreg'));
        if (selectedOpp?.id === oppId) setSelectedOpp(null);
      }
    } catch {
      showToast(t('toast_unreg_error'), 'error');
    }
  };

  if (store.ready === false) {
    return (
      <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin mb-4" />
        <p className="text-emerald-700 font-semibold text-sm">
          {t('loading')}
        </p>
      </div>
    );
  }

  return (
    <div dir="rtl" className={`min-h-screen font-sans
      ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-gray-900'}`}>

      <Navbar
        theme={theme} lang={lang} currentUser={currentUser}
        currentScreen={currentScreen}
        onToggleDark={() => setTheme(p => p === 'dark' ? '' : 'dark')}
        onToggleLang={() => setLang(p => p === 'he' ? 'ar' : 'he')}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {toast && (
        <div className={`animate-toast fixed top-20 left-1/2 z-[70]
          ${toastType === 'error' ? 'bg-red-500' : 'bg-emerald-600'}
          text-white px-5 py-3 rounded-2xl shadow-xl
          text-sm font-semibold flex items-center gap-2 whitespace-nowrap pointer-events-none`}>
          <span className="text-base">{toastType === 'error' ? '✕' : '✓'}</span>
          {toast}
        </div>
      )}

      <main className="pt-20 sm:pt-20">

        {currentScreen === 'home' && (
          <HomePage
            store={store}
            currentUser={currentUser}
            lang={lang}
            handleNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'login' && (
          <LoginPage lang={lang} onLogin={handleLogin} onNavigate={handleNavigate} />
        )}

        {currentScreen === 'opportunities' && (
          <OpportunitiesBoardPage
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

        {currentScreen === 'hot-this-week' && (
          <HotThisWeekPage
            opportunities={store.opportunities}
            lang={lang}
            onOpenModal={openOppModal}
          />
        )}

        {currentScreen === 'gallery' && (
          <GalleryPage lang={lang} />
        )}

        {currentScreen === 'about' && (
          <AboutPage lang={lang} />
        )}

        {currentScreen === 'my-registrations' && currentUser?.role === 'User' && (
          <MyRegistrationsPage
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
            showToast={showToast}
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