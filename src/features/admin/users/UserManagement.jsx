import { useCallback, useMemo, useState } from 'react';
import { useT } from '../../../i18n/i18n';
import ConfirmModal from '../../../shared/components/ConfirmModal';
import UserFilters from './components/UserFilters';
import UserFormModal from './components/UserFormModal';
import UsersTable from './components/UsersTable';
import { useUsers } from './hooks/useUsers';

export default function UserManagement({ lang, currentUser, showToast }) {
  const t = useT(lang);
  const loadErrorMessage = t('users_load_toast_error');
  const [modalUser, setModalUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filters, setFilters] = useState({ name: '', username: '', role: '', organization: '' });

  const handleLoadError = useCallback(() => {
    showToast(loadErrorMessage, 'error');
  }, [loadErrorMessage, showToast]);
  const userData = useUsers({ onLoadError: handleLoadError });

  const filteredUsers = useMemo(() => userData.users.filter(user => {
    if (filters.name && !user.name?.toLowerCase().includes(filters.name.toLowerCase())) return false;
    if (filters.username && !user.username?.toLowerCase().includes(filters.username.toLowerCase())) return false;
    if (filters.role && user.role !== filters.role) return false;
    if (filters.organization && user.organizationId !== filters.organization) return false;
    return true;
  }), [filters, userData.users]);

  const saveUser = async data => {
    if (modalUser === 'new') {
      await userData.createUser(data);
      showToast(t('users_created_success'));
    } else {
      await userData.updateUser(modalUser.id, data);
      showToast(t('users_updated_success'));
    }
    setModalUser(null);
  };

  const deleteUser = async () => {
    if (!deleteTarget) return;
    try {
      await userData.deleteUser(deleteTarget.id);
      showToast(t('users_deleted_success'));
    } catch {
      showToast(t('users_delete_error'), 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  if (userData.loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-500" />
        <p className="text-sm">{t('users_loading')}</p>
      </div>
    );
  }

  if (userData.loadError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
        <p className="mb-4 text-sm font-semibold text-red-700">{t('users_load_error')}</p>
        <button onClick={userData.reload} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white">
          {t('users_retry')}
        </button>
      </div>
    );
  }

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-black text-gray-800">
          {t('users_all_users')}
          <span className="mr-2 text-xs font-medium text-gray-400">
            ({filteredUsers.length}{hasFilters ? ` / ${userData.users.length}` : ''})
          </span>
        </h3>
        <button onClick={() => setModalUser('new')} className="shrink-0 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700">
          + {t('users_add_user')}
        </button>
      </div>

      <UserFilters lang={lang} filters={filters} onChange={setFilters} />
      <UsersTable
        lang={lang}
        users={filteredUsers}
        currentUserId={currentUser.id}
        hasFilters={hasFilters}
        onEdit={setModalUser}
        onDelete={setDeleteTarget}
        onClearFilters={() => setFilters({ name: '', username: '', role: '', organization: '' })}
      />

      {modalUser !== null && (
        <UserFormModal
          lang={lang}
          initial={modalUser === 'new' ? null : modalUser}
          onSave={saveUser}
          onClose={() => setModalUser(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          lang={lang}
          title={t('users_delete_title')}
          message={t('users_delete_message', { name: deleteTarget.name, username: deleteTarget.username })}
          confirmLabel={t('users_delete_confirm')}
          danger
          onConfirm={deleteUser}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
