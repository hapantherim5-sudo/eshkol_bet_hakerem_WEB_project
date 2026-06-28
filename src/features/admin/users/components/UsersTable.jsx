import { getOrgName } from '../../../../data/organizations';
import { useT } from '../../../../i18n/i18n';

const ROLE_BADGE = {
  Admin: 'bg-violet-100 text-violet-700',
  Staff: 'bg-blue-100 text-blue-700',
  User: 'bg-emerald-100 text-emerald-700',
};

export default function UsersTable({ lang, users, currentUserId, hasFilters, onEdit, onDelete, onClearFilters }) {
  const t = useT(lang);
  const isArabic = lang === 'ar';
  const roleLabel = role => t(role === 'Admin' ? 'users_role_admin' : role === 'Staff' ? 'users_role_staff' : 'users_role_youth');

  if (!users.length) {
    return (
      <div className="py-14 text-center text-gray-400">
        <p className="mb-2 text-4xl">{hasFilters ? '🔍' : '👤'}</p>
        <p className="font-semibold text-gray-500">{t(hasFilters ? 'users_search_empty' : 'users_empty')}</p>
        {hasFilters && <button onClick={onClearFilters} className="mt-2 text-xs text-emerald-600 hover:underline">{t('users_clear_filter')}</button>}
      </div>
    );
  }

  return (
    <div className="-mx-4 overflow-x-auto rounded-xl border bg-white px-4 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[520px] text-sm">
        <thead className="border-b border-gray-100 bg-gray-50">
          <tr>{['name', 'username', 'role', 'organization', 'actions'].map(column => (
            <th key={column} className="p-3 text-right font-semibold text-gray-500">{t(`users_column_${column}`)}</th>
          ))}</tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t border-gray-50 transition-colors hover:bg-gray-50/70">
              <td className="p-3 font-medium text-gray-800">{user.name}</td>
              <td className="p-3 font-mono text-xs text-gray-500">{user.username}</td>
              <td className="p-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${ROLE_BADGE[user.role]}`}>{roleLabel(user.role)}</span></td>
              <td className="max-w-[160px] truncate p-3 text-xs text-gray-500">{getOrgName(user.organizationId, isArabic) || '-'}</td>
              <td className="p-3"><div className="flex justify-center gap-2">
                <button onClick={() => onEdit(user)} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs hover:bg-emerald-50">{t('admin_edit')}</button>
                <button disabled={user.id === currentUserId} onClick={() => onDelete(user)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-30">{t('admin_delete')}</button>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
