// Frontend composition root: global session, data, navigation, and overlays.
import { useEffect } from 'react';
import AppOverlays from './AppOverlays';
import ScreenSwitcher from './ScreenSwitcher';
import { LoadErrorScreen, LoadingScreen } from './AppStatus';
import { useApiStore } from './store/useApiStore';
import { useAppPreferences } from './hooks/useAppPreferences';
import { useSession } from './hooks/useSession';
import { useToast } from './hooks/useToast';
import Navbar from '../shared/components/Navbar';
import { useOpportunityWorkflow } from '../features/opportunities/hooks/useOpportunityWorkflow';
import { useOpportunityFilters } from '../features/opportunities/hooks/useOpportunityFilters';
import { useT } from '../i18n/i18n';
import Toast from '../shared/components/Toast';
import { isStaffRole } from '../utils/permissions';

function App() {
  const store = useApiStore();
  const {
    currentScreen,
    setCurrentScreen,
    theme,
    lang,
    toggleTheme,
    toggleLanguage,
  } = useAppPreferences();
  const { currentUser, signIn, signOut } = useSession();
  const { toast, showToast } = useToast();
  const t = useT(lang);
  const opportunityFilters = useOpportunityFilters(store.opportunities, lang === 'ar');

  const handleLogin = async session => {
    signIn(session);
    await store.reload();
    setCurrentScreen(isStaffRole(session.user) ? 'admin' : 'opportunities');
  };

  const handleLogout = async () => {
    signOut();
    setCurrentScreen('home');
    await store.reload();
  };

  useEffect(() => {
    if (!currentUser && ['admin', 'my-registrations'].includes(currentScreen)) {
      setCurrentScreen('home');
    }
  }, [currentScreen, currentUser, setCurrentScreen]);

  const handleNavigate = screen => {
    if (screen === 'admin' && !isStaffRole(currentUser)) {
      setCurrentScreen('login');
      return;
    }
    if (screen === 'my-registrations' && currentUser?.role !== 'User') {
      setCurrentScreen('login');
      showToast(t('toast_youth_login'));
      return;
    }
    setCurrentScreen(screen);
  };

  const opportunityWorkflow = useOpportunityWorkflow({
    store,
    currentUser,
    navigate: handleNavigate,
    showToast,
    t,
  });

  if (!store.ready) return <LoadingScreen label={t('loading')} />;
  if (store.loadError) {
    return (
      <LoadErrorScreen
        title={t('api_load_error_title')}
        description={t('api_load_error_description')}
        retryLabel={t('api_load_retry')}
      />
    );
  }

  return (
    <div dir="rtl" className={`min-h-screen font-sans ${
      theme === 'dark' ? 'app-dark bg-slate-900 text-white' : 'bg-slate-50 text-gray-900'
    }`}>
      <Navbar
        theme={theme}
        lang={lang}
        currentUser={currentUser}
        currentScreen={currentScreen}
        onToggleDark={toggleTheme}
        onToggleLang={toggleLanguage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <Toast toast={toast} />

      <main className="pt-20 sm:pt-20">
        <ScreenSwitcher
          currentScreen={currentScreen}
          currentUser={currentUser}
          lang={lang}
          store={store}
          opportunityFilters={opportunityFilters}
          onNavigate={handleNavigate}
          onLogin={handleLogin}
          onOpenOpportunity={opportunityWorkflow.openOpportunity}
          onCancelRegistration={opportunityWorkflow.cancelRegistration}
          showToast={showToast}
        />
      </main>

      <AppOverlays
        lang={lang}
        currentUser={currentUser}
        store={store}
        workflow={opportunityWorkflow}
      />
    </div>
  );
}

export default App;
