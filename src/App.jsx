import AppOverlays from './app/AppOverlays';
import ScreenSwitcher from './app/ScreenSwitcher';
import { LoadErrorScreen, LoadingScreen } from './app/AppStatus';
import { useDataStore } from './app/data/useDataStore';
import { useAppPreferences } from './app/hooks/useAppPreferences';
import { useSession } from './app/hooks/useSession';
import { useToast } from './app/hooks/useToast';
import Navbar from './shared/components/Navbar';
import { useOpportunityWorkflow } from './features/opportunities/hooks/useOpportunityWorkflow';
import { useOpportunityFilters } from './features/opportunities/hooks/useOpportunityFilters';
import { useT } from './i18n/i18n';
import Toast from './shared/components/Toast';
import { isStaffRole } from './utils/permissions';

function App() {
  const store = useDataStore();
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

  const handleLogin = user => {
    signIn(user);
    setCurrentScreen(isStaffRole(user) ? 'admin' : 'opportunities');
  };

  const handleLogout = () => {
    signOut();
    setCurrentScreen('home');
  };

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
