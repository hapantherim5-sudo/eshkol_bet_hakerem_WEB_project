import { useState, useEffect, useMemo } from 'react';
import { api, apiEnabled } from '../../services/api';
import { ORGANIZATIONS } from '../../data/organizations';
import { pick } from '../../i18n/i18n';
import ConfirmModal from '../ConfirmModal';

const ROLE_BADGE = {
  Admin: 'bg-violet-100 text-violet-700',
  Staff: 'bg-blue-100 text-blue-700',
  User:  'bg-emerald-100 text-emerald-700',
};

const emptyForm = () => ({
  name: '', username: '', password: '', role: 'User', organizationId: '',
});

/* ── Create / Edit form modal ── */
function UserFormModal({ lang, initial, onSave, onClose }) {
  const isAr  = lang === 'ar';
  const t     = (he, ar) => pick(isAr, he, ar);
  const isEdit = !!initial;

  const [form,   setForm  ] = useState(() => initial ? { ...initial, password: '' } : emptyForm());
  const [err,    setErr   ] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleRoleChange = (role) => {
    set('role', role);
    if (role === 'User') set('organizationId', '');
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.username.trim()) {
      setErr(t('שם מלא ושם משתמש הם שדות חובה', 'الاسم الكامل واسم المستخدم مطلوبان'));
      return;
    }
    if (!isEdit && !form.password.trim()) {
      setErr(t('סיסמה היא שדה חובה', 'كلمة المرور مطلوبة'));
      return;
    }
    if (form.role === 'Staff' && !form.organizationId) {
      setErr(t('יש לבחור ארגון עבור משתמש סגל', 'يجب اختيار منظمة لمستخدم الطاقم'));
      return;
    }
    setSaving(true);
    setErr('');
    try {
      const payload = { ...form };
      if (isEdit && !payload.password.trim()) delete payload.password;
      if (payload.role !== 'Staff' && payload.role !== 'Admin') delete payload.organizationId;
      await onSave(payload);
    } catch (e) {
      if (e.status === 409) {
        setErr(t('שם המשתמש כבר קיים במערכת', 'اسم المستخدم مستخدم بالفعل'));
      } else {
        setErr(t('שגיאה בשמירה, נסה שוב', 'خطأ في الحفظ، حاول مرة أخرى'));
      }
      setSaving(false);
    }
  };

  const fieldCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition bg-white';
  const labelCls = 'block text-xs font-semibold text-gray-600 mb-1';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full shadow-2xl max-h-[92vh] overflow-y-auto"
      >
        <div className="p-5 sm:p-6">
          <h3 className="text-lg font-black text-gray-800 mb-5">
            {isEdit ? t('✏️ עריכת משתמש', '✏️ تعديل المستخدم') : t('➕ הוספת משתמש', '➕ إضافة مستخدم')}
          </h3>

          <div className="space-y-3">
            <div>
              <label className={labelCls}>{t('שם מלא *', 'الاسم الكامل *')}</label>
              <input
                className={fieldCls}
                placeholder={t('ישראל ישראלי', 'محمد أحمد')}
                value={form.name}
                onChange={e => set('name', e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>{t('שם משתמש *', 'اسم المستخدم *')}</label>
              <input
                className={fieldCls}
                placeholder="israel123"
                value={form.username}
                onChange={e => set('username', e.target.value)}
                dir="ltr"
              />
            </div>

            <div>
              <label className={labelCls}>
                {isEdit
                  ? t('סיסמה חדשה (השאר ריק לשמור הנוכחית)', 'كلمة مرور جديدة (اتركها فارغة للإبقاء)')
                  : t('סיסמה *', 'كلمة المرور *')}
              </label>
              <input
                type="password"
                className={fieldCls}
                placeholder="••••••"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                dir="ltr"
              />
            </div>

            <div>
              <label className={labelCls}>{t('תפקיד *', 'الدور *')}</label>
              <select
                className={fieldCls}
                value={form.role}
                onChange={e => handleRoleChange(e.target.value)}
              >
                <option value="Admin">{t('מנהל (Admin)', 'مسؤول (Admin)')}</option>
                <option value="Staff">{t('סגל עירוני (Staff)', 'طاقم بلدي (Staff)')}</option>
                <option value="User">{t('משתמש / נוער (User)', 'مستخدم / شباب (User)')}</option>
              </select>
            </div>

            {(form.role === 'Staff' || form.role === 'Admin') && (
              <div>
                <label className={labelCls}>
                  {form.role === 'Staff'
                    ? t('ארגון / עיר *', 'المنظمة / المدينة *')
                    : t('ארגון (אופציונלי)', 'المنظمة (اختياري)')}
                </label>
                <select
                  className={fieldCls}
                  value={form.organizationId}
                  onChange={e => set('organizationId', e.target.value)}
                >
                  <option value="">{t('— בחר ארגון —', '— اختر منظمة —')}</option>
                  {ORGANIZATIONS.map(o => (
                    <option key={o.id} value={o.id}>
                      {isAr ? o.nameAr : o.nameHe}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {err && (
            <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
              {err}
            </p>
          )}

          <div className="mt-5 flex flex-col sm:flex-row gap-2">
            <button
              onClick={onClose}
              disabled={saving}
              className="flex-1 py-3 sm:py-2.5 min-h-[44px] text-sm text-gray-600 border rounded-xl hover:bg-gray-50 transition"
            >
              {t('ביטול', 'إلغاء')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 py-3 sm:py-2.5 min-h-[44px] text-sm text-white font-bold bg-emerald-600 hover:bg-emerald-700 rounded-xl transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving
                ? <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                : isEdit ? t('שמור שינויים', 'حفظ التغييرات') : t('הוסף משתמש', 'إضافة مستخدم')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Filter bar ── */
function FilterBar({ lang, searchName, searchUsername, filterRole, filterOrg, onChange }) {
  const isAr = lang === 'ar';
  const t    = (he, ar) => pick(isAr, he, ar);

  const inputCls  = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition bg-white';
  const selectCls = inputCls;

  const hasFilters = searchName || searchUsername || filterRole || filterOrg;

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-100 p-3 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        <input
          className={inputCls}
          placeholder={t('🔍 חיפוש לפי שם...', '🔍 ابحث بالاسم...')}
          value={searchName}
          onChange={e => onChange('searchName', e.target.value)}
        />
        <input
          className={inputCls}
          placeholder={t('🔍 חיפוש לפי שם משתמש...', '🔍 ابحث باسم المستخدم...')}
          value={searchUsername}
          onChange={e => onChange('searchUsername', e.target.value)}
          dir="ltr"
        />
        <select
          className={selectCls}
          value={filterRole}
          onChange={e => onChange('filterRole', e.target.value)}
        >
          <option value="">{t('— כל התפקידים —', '— جميع الأدوار —')}</option>
          <option value="Admin">{t('מנהל', 'مسؤول')}</option>
          <option value="Staff">{t('סגל', 'طاقم')}</option>
          <option value="User">{t('נוער', 'شباب')}</option>
        </select>
        <select
          className={selectCls}
          value={filterOrg}
          onChange={e => onChange('filterOrg', e.target.value)}
        >
          <option value="">{t('— כל הארגונים —', '— جميع المنظمات —')}</option>
          {ORGANIZATIONS.map(o => (
            <option key={o.id} value={o.id}>
              {isAr ? o.nameAr : o.nameHe}
            </option>
          ))}
        </select>
      </div>
      {hasFilters && (
        <button
          onClick={() => { onChange('searchName', ''); onChange('searchUsername', ''); onChange('filterRole', ''); onChange('filterOrg', ''); }}
          className="mt-2 text-xs text-gray-400 hover:text-red-500 transition"
        >
          ✕ {t('נקה סינון', 'مسح الفلتر')}
        </button>
      )}
    </div>
  );
}

/* ── Main export ── */
export default function UserManagement({ lang, currentUser, showToast }) {
  const isAr = lang === 'ar';
  const t    = (he, ar) => pick(isAr, he, ar);

  const [users,        setUsers       ] = useState([]);
  const [loading,      setLoading     ] = useState(true);
  const [loadError,    setLoadError   ] = useState(null);   // null | Error
  const [modalUser,    setModalUser   ] = useState(null);   // null | 'new' | user object
  const [deleteTarget, setDeleteTarget] = useState(null);

  /* Filters */
  const [searchName,    setSearchName   ] = useState('');
  const [searchUsername, setSearchUsername] = useState('');
  const [filterRole,    setFilterRole   ] = useState('');
  const [filterOrg,     setFilterOrg    ] = useState('');

  /* ── Load from API ──
     BUG FIX: useEffect now guards with apiEnabled() so it never fires
     when the API is unavailable, preventing a spurious error toast. */
  const loadUsers = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (e) {
      /* Preserve the real error so we can show it in the UI */
      setLoadError(e);
      showToast(t('שגיאה בטעינת המשתמשים', 'خطأ في تحميل المستخدمين'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    /* Only run when the API is reachable — prevents false error toasts
       in localStorage-mode where there is no backend to call.           */
    if (!apiEnabled()) return;
    loadUsers();
  // loadUsers is stable within this mount — no deps needed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Filtered view — computed from full users array */
  const filteredUsers = useMemo(() => {
    const nameLo     = searchName.toLowerCase();
    const usernameLo = searchUsername.toLowerCase();
    return users.filter(u => {
      if (nameLo     && !u.name?.toLowerCase().includes(nameLo))         return false;
      if (usernameLo && !u.username?.toLowerCase().includes(usernameLo)) return false;
      if (filterRole && u.role !== filterRole)                           return false;
      if (filterOrg  && u.organizationId !== filterOrg)                  return false;
      return true;
    });
  }, [users, searchName, searchUsername, filterRole, filterOrg]);

  const hasActiveFilter = searchName || searchUsername || filterRole || filterOrg;

  const handleFilterChange = (key, value) => {
    if (key === 'searchName')    setSearchName(value);
    if (key === 'searchUsername') setSearchUsername(value);
    if (key === 'filterRole')    setFilterRole(value);
    if (key === 'filterOrg')     setFilterOrg(value);
  };

  /* ── Save (create or update) ── */
  const handleSave = async (data) => {
    if (modalUser === 'new') {
      await api.createUser(data);
      showToast(t('✓ המשתמש נוצר בהצלחה', '✓ تم إنشاء المستخدم بنجاح'));
    } else {
      await api.updateUser(modalUser.id, data);
      showToast(t('✓ המשתמש עודכן בהצלחה', '✓ تم تحديث المستخدم بنجاح'));
    }
    setModalUser(null);
    await loadUsers();
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteUser(deleteTarget.id);
      showToast(t('המשתמש נמחק', 'تم حذف المستخدم'));
    } catch {
      showToast(t('שגיאה במחיקת המשתמש', 'خطأ في حذف المستخدم'), 'error');
    } finally {
      setDeleteTarget(null);
      await loadUsers();
    }
  };

  /* ── Helpers ── */
  const roleLabel = (role) =>
    role === 'Admin' ? t('מנהל', 'مسؤول') :
    role === 'Staff' ? t('סגל',  'طاقم')  :
                       t('נוער', 'شباب');

  const orgLabel = (orgId) => {
    const org = ORGANIZATIONS.find(o => o.id === orgId);
    return org ? (isAr ? org.nameAr : org.nameHe) : '—';
  };

  /* ── API unavailable (localStorage mode) ── */
  if (!apiEnabled()) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        <p className="text-4xl mb-3">🔌</p>
        <p className="font-semibold text-gray-500 mb-1">
          {t('ניהול משתמשים זמין רק במצב API', 'إدارة المستخدمين متاحة في وضع API فقط')}
        </p>
        <p className="text-xs">
          {t('הוסף VITE_USE_API=true ל-.env כדי להפעיל', 'أضف VITE_USE_API=true إلى ملف .env للتفعيل')}
        </p>
      </div>
    );
  }

  /* ── Loading spinner ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
        <div className="w-9 h-9 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin" />
        <p className="text-sm">{t('טוען משתמשים...', 'جاري تحميل المستخدمين...')}</p>
      </div>
    );
  }

  /* ── Load error ── */
  if (loadError) {
    const detail = loadError?.body?.error || loadError?.message || '';
    return (
      <div className="text-center py-14">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="font-black text-gray-700 mb-1">
          {t('לא ניתן לטעון את רשימת המשתמשים', 'تعذّر تحميل قائمة المستخدمين')}
        </p>
        {detail && (
          <p className="text-xs text-red-500 font-mono bg-red-50 inline-block px-3 py-1 rounded-lg mb-4">
            {detail}
          </p>
        )}
        <div>
          <button
            onClick={loadUsers}
            className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition"
          >
            {t('נסה שוב', 'حاول مجدداً')}
          </button>
        </div>
      </div>
    );
  }

  /* ── Main content ── */
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <h3 className="font-black text-gray-800 text-base">
          {t('כל המשתמשים', 'جميع المستخدمين')}
          <span className="mr-2 text-xs font-medium text-gray-400">
            ({filteredUsers.length}{hasActiveFilter ? ` / ${users.length}` : ''})
          </span>
        </h3>
        <button
          onClick={() => setModalUser('new')}
          className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition shrink-0"
        >
          + {t('הוסף משתמש', 'أضف مستخدم')}
        </button>
      </div>

      {/* Filter bar */}
      <FilterBar
        lang={lang}
        searchName={searchName}
        searchUsername={searchUsername}
        filterRole={filterRole}
        filterOrg={filterOrg}
        onChange={handleFilterChange}
      />

      {/* Table or empty state */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-14 text-gray-400">
          {hasActiveFilter ? (
            <>
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-semibold text-gray-500 mb-2">
                {t('לא נמצאו משתמשים התואמים לחיפוש', 'لا يوجد مستخدمون يطابقون البحث')}
              </p>
              <button
                onClick={() => { setSearchName(''); setSearchUsername(''); setFilterRole(''); setFilterOrg(''); }}
                className="text-xs text-emerald-600 hover:underline"
              >
                {t('נקה את הסינון', 'مسح الفلتر')}
              </button>
            </>
          ) : (
            <>
              <p className="text-4xl mb-3">👤</p>
              <p className="font-semibold text-gray-500">
                {t('אין משתמשים במערכת עדיין', 'لا يوجد مستخدمون في النظام بعد')}
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full text-sm min-w-[520px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right p-3 font-semibold text-gray-500">{t('שם', 'الاسم')}</th>
                <th className="text-right p-3 font-semibold text-gray-500">{t('שם משתמש', 'اسم المستخدم')}</th>
                <th className="text-right p-3 font-semibold text-gray-500">{t('תפקיד', 'الدور')}</th>
                <th className="text-right p-3 font-semibold text-gray-500">{t('ארגון', 'المنظمة')}</th>
                <th className="p-3 font-semibold text-gray-500 text-center">{t('פעולות', 'إجراءات')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} className="border-t border-gray-50 hover:bg-gray-50/70 transition-colors">
                  <td className="p-3 font-medium text-gray-800">{u.name}</td>
                  <td className="p-3 text-gray-500 font-mono text-xs">{u.username}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${ROLE_BADGE[u.role] ?? 'bg-gray-100 text-gray-600'}`}>
                      {roleLabel(u.role)}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500 text-xs max-w-[160px] truncate">
                    {orgLabel(u.organizationId)}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setModalUser(u)}
                        className="text-xs px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition"
                      >
                        {t('ערוך', 'تعديل')}
                      </button>
                      <button
                        onClick={() => setDeleteTarget(u)}
                        disabled={u.id === currentUser.id}
                        title={u.id === currentUser.id
                          ? t('לא ניתן למחוק את עצמך', 'لا يمكنك حذف حسابك الخاص')
                          : undefined}
                        className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {t('מחק', 'حذف')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit modal */}
      {modalUser !== null && (
        <UserFormModal
          lang={lang}
          initial={modalUser === 'new' ? null : modalUser}
          onSave={handleSave}
          onClose={() => setModalUser(null)}
        />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <ConfirmModal
          lang={lang}
          titleHe="מחיקת משתמש"
          titleAr="حذف المستخدم"
          messageHe={`האם אתה בטוח שברצונך למחוק את "${deleteTarget.name}" (${deleteTarget.username})?`}
          messageAr={`هل أنت متأكد أنك تريد حذف "${deleteTarget.name}" (${deleteTarget.username})؟`}
          confirmHe="כן, מחק"
          confirmAr="نعم، احذف"
          danger
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
