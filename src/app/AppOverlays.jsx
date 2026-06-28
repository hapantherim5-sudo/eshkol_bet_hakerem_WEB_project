import OpportunityDetailModal from '../features/opportunities/components/OpportunityDetailModal';
import RegistrationModal from '../features/opportunities/components/RegistrationModal';

export default function AppOverlays({ lang, currentUser, store, workflow }) {
  const { selectedOpportunity, registrationOpen } = workflow;
  const isRegistered = currentUser?.role === 'User' && selectedOpportunity
    ? store.isRegistered(currentUser.id, selectedOpportunity.id)
    : false;

  return (
    <>
      {selectedOpportunity && !registrationOpen && (
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          lang={lang}
          isRegistered={isRegistered}
          onClose={workflow.closeOpportunity}
          onRegisterClick={workflow.requestRegistration}
          onCancelRegistration={isRegistered
            ? () => workflow.cancelRegistration(selectedOpportunity.id)
            : null}
        />
      )}

      {registrationOpen && selectedOpportunity && currentUser && (
        <RegistrationModal
          opportunity={selectedOpportunity}
          lang={lang}
          profile={store.getProfile(currentUser.id)}
          onConfirm={workflow.confirmRegistration}
          onClose={workflow.closeRegistration}
        />
      )}
    </>
  );
}
