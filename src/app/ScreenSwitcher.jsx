import StaffPanel from '../features/admin/components/StaffPanel';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import EventsCalendar from '../features/calendar/components/EventsCalendar';
import GalleryPage from '../features/gallery/pages/GalleryPage';
import HomePage from '../features/home/pages/HomePage';
import OpportunitiesBoardPage from '../features/opportunities/pages/OpportunitiesBoardPage';
import MyRegistrationsPage from '../features/registrations/pages/MyRegistrationsPage';
import { isStaffRole } from '../utils/permissions';

export default function ScreenSwitcher({
  currentScreen,
  currentUser,
  lang,
  store,
  onNavigate,
  onLogin,
  onOpenOpportunity,
  onCancelRegistration,
  showToast,
}) {
  switch (currentScreen) {
    case 'home':
      return (
        <HomePage
          currentUser={currentUser}
          lang={lang}
          handleNavigate={onNavigate}
          opportunitiesCount={store.opportunities.length}
        />
      );
    case 'login':
      return <LoginPage lang={lang} onLogin={onLogin} onNavigate={onNavigate} />;
    case 'register':
      return <RegisterPage lang={lang} onNavigate={onNavigate} />;
    case 'opportunities':
      return (
        <OpportunitiesBoardPage
          opportunities={store.opportunities}
          lang={lang}
          onOpenModal={onOpenOpportunity}
        />
      );
    case 'calendar':
      return (
        <EventsCalendar
          lang={lang}
          opportunities={store.opportunities}
          events={store.events}
          onOpenOpp={onOpenOpportunity}
          onNavigate={onNavigate}
          currentUser={currentUser}
          registrations={store.registrations}
        />
      );
    case 'gallery':
      return <GalleryPage lang={lang} />;
    case 'my-registrations':
      return currentUser?.role === 'User' ? (
        <MyRegistrationsPage
          lang={lang}
          currentUser={currentUser}
          opportunities={store.opportunities}
          registrations={store.registrations}
          onOpenModal={onOpenOpportunity}
          onCancel={onCancelRegistration}
          onNavigate={onNavigate}
        />
      ) : null;
    case 'admin':
      return isStaffRole(currentUser) ? (
        <StaffPanel
          lang={lang}
          currentUser={currentUser}
          opportunities={store.opportunities}
          views={store.views}
          registrations={store.registrations}
          cancellations={store.cancellations}
          profiles={store.profiles}
          onAdd={store.addOpportunity}
          onUpdate={store.updateOpportunity}
          onDelete={store.deleteOpportunity}
          onReplaceEventsForOpportunity={store.replaceEventsForOpportunity}
          showToast={showToast}
        />
      ) : null;
    default:
      return null;
  }
}
