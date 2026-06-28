import { ORGANIZATIONS, getOrgName } from '../../../../data/organizations';
import { useT } from '../../../../i18n/i18n';

const EMPTY_FILTERS = { name: '', username: '', role: '', organization: '' };

export default function UserFilters({ lang, filters, onChange }) {
  const t = useT(lang);
  const isArabic = lang === 'ar';
  const inputClass = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300';
  const update = (field, value) => onChange(current => ({ ...current, [field]: value }));

  return (
    <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
        <input className={inputClass} placeholder={t('users_search_name')} value={filters.name} onChange={event => update('name', event.target.value)} />
        <input dir="ltr" className={inputClass} placeholder={t('users_search_username')} value={filters.username} onChange={event => update('username', event.target.value)} />
        <select className={inputClass} value={filters.role} onChange={event => update('role', event.target.value)}>
          <option value="">{t('users_all_roles')}</option>
          <option value="Admin">{t('users_role_admin')}</option>
          <option value="Staff">{t('users_role_staff')}</option>
          <option value="User">{t('users_role_youth')}</option>
        </select>
        <select className={inputClass} value={filters.organization} onChange={event => update('organization', event.target.value)}>
          <option value="">{t('users_all_organizations')}</option>
          {ORGANIZATIONS.map(organization => (
            <option key={organization.id} value={organization.id}>{getOrgName(organization.id, isArabic)}</option>
          ))}
        </select>
      </div>
      {Object.values(filters).some(Boolean) && (
        <button onClick={() => onChange(EMPTY_FILTERS)} className="mt-2 text-xs text-gray-400 transition hover:text-red-500">
          ✕ {t('users_clear_filter')}
        </button>
      )}
    </div>
  );
}
