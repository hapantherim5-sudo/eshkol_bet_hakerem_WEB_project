import { useState } from 'react';

export function useOpportunityWorkflow({ store, currentUser, navigate, showToast, t }) {
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  const openOpportunity = opportunity => {
    setSelectedOpportunity(opportunity);
    store.recordView(opportunity.id, currentUser?.id);
  };

  const closeOpportunity = () => setSelectedOpportunity(null);
  const closeRegistration = () => setRegistrationOpen(false);

  const requestRegistration = () => {
    if (!currentUser) {
      setSelectedOpportunity(null);
      navigate('login');
      showToast(t('toast_login_required'));
      return;
    }
    if (currentUser.role !== 'User') {
      showToast(t('toast_staff_only'));
      return;
    }
    setRegistrationOpen(true);
  };

  const confirmRegistration = async profilePatch => {
    try {
      const result = await store.register(
        currentUser.id,
        selectedOpportunity.id,
        profilePatch
      );
      setRegistrationOpen(false);
      showToast(t(result.ok ? 'toast_registered' : 'toast_already_reg'));
    } catch {
      showToast(t('toast_reg_error'), 'error');
    }
  };

  const cancelRegistration = async opportunityId => {
    if (!currentUser || currentUser.role !== 'User') return;
    const targetId = opportunityId ?? selectedOpportunity?.id;
    if (!targetId) return;

    try {
      const result = await store.unregister(currentUser.id, targetId);
      if (result.ok) {
        showToast(t('toast_unreg'));
        if (selectedOpportunity?.id === targetId) setSelectedOpportunity(null);
      }
    } catch {
      showToast(t('toast_unreg_error'), 'error');
    }
  };

  return {
    selectedOpportunity,
    registrationOpen,
    openOpportunity,
    closeOpportunity,
    closeRegistration,
    requestRegistration,
    confirmRegistration,
    cancelRegistration,
  };
}
