import { useState } from 'react';
import { ORGANIZATIONS, getOrgName } from '../../../../data/organizations';
import { useT } from '../../../../i18n/i18n';

const emptyUser = () => ({ name: '', username: '', password: '', role: 'User', organizationId: '' });

export default function UserFormModal({ lang, initial, onSave, onClose }) {
  const t = useT(lang);
  const isArabic = lang === 'ar';
  const editing = Boolean(initial);
  const [form, setForm] = useState(() => initial ? { ...initial, password: '' } : emptyUser());
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const update = (field, value) => setForm(current => ({ ...current, [field]: value }));

  const submit = async event => {
    event.preventDefault();
    if (!form.name.trim() || !form.username.trim()) return setError(t('users_error_name_username_required'));
    if (!editing && !form.password.trim()) return setError(t('users_error_password_required'));
    if (form.role === 'Staff' && !form.organizationId) return setError(t('users_error_staff_org_required'));

    const payload = { ...form };
    if (editing && !payload.password.trim()) delete payload.password;
    if (!['Staff', 'Admin'].includes(payload.role)) delete payload.organizationId;

    setSaving(true);
    setError('');
    try {
      await onSave(payload);
    } catch (saveError) {
      setError(t(saveError.status === 409 ? 'users_error_username_exists' : 'users_error_save'));
      setSaving(false);
    }
  };

  const inputClass = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-300';
  const labelClass = 'mb-1 block text-xs font-semibold text-gray-600';

  return (
    <div onClick={onClose} className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 sm:items-center sm:p-4">
      <form onSubmit={submit} onClick={event => event.stopPropagation()} className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6">
        <h3 className="mb-5 text-lg font-black text-gray-800">{t(editing ? 'users_edit_title' : 'users_add_title')}</h3>
        <div className="space-y-3">
          <Field label={t('users_full_name')} className={labelClass}>
            <input className={inputClass} value={form.name} onChange={event => update('name', event.target.value)} />
          </Field>
          <Field label={t('users_username')} className={labelClass}>
            <input dir="ltr" className={inputClass} value={form.username} onChange={event => update('username', event.target.value)} />
          </Field>
          <Field label={t(editing ? 'users_new_password' : 'users_password')} className={labelClass}>
            <input dir="ltr" type="password" className={inputClass} value={form.password} onChange={event => update('password', event.target.value)} />
          </Field>
          <Field label={t('users_role')} className={labelClass}>
            <select className={inputClass} value={form.role} onChange={event => {
              const role = event.target.value;
              setForm(current => ({ ...current, role, organizationId: role === 'User' ? '' : current.organizationId }));
            }}>
              <option value="Admin">{t('users_role_admin_full')}</option>
              <option value="Staff">{t('users_role_staff_full')}</option>
              <option value="User">{t('users_role_user_full')}</option>
            </select>
          </Field>
          {['Staff', 'Admin'].includes(form.role) && (
            <Field label={t(form.role === 'Staff' ? 'users_staff_organization' : 'users_optional_organization')} className={labelClass}>
              <select className={inputClass} value={form.organizationId || ''} onChange={event => update('organizationId', event.target.value)}>
                <option value="">{t('users_select_organization')}</option>
                {ORGANIZATIONS.map(organization => (
                  <option key={organization.id} value={organization.id}>{getOrgName(organization.id, isArabic)}</option>
                ))}
              </select>
            </Field>
          )}
        </div>

        {error && <p className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button type="button" disabled={saving} onClick={onClose} className="min-h-[44px] flex-1 rounded-xl border py-2.5 text-sm text-gray-600">{t('cancel')}</button>
          <button disabled={saving} className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white disabled:opacity-60">
            {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : t(editing ? 'users_save_changes' : 'users_add_user')}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, className, children }) {
  return <div><label className={className}>{label}</label>{children}</div>;
}
