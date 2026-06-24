import { useState } from 'react';
import { filterManageable, canManageOpportunity } from '../../utils/permissions';
import { getOrgName } from '../../data/organizations';
import { pick } from '../../i18n/i18n';
import OpportunityForm from './OpportunityForm';
import UserManagement from './UserManagement';
import StatsDashboard from './StatsDashboard';

function StaffPanel({
  lang, currentUser, opportunities, events, views, registrations, cancellations, profiles,
  onAdd, onUpdate, onDelete, onAddEvent, onDeleteEvent, onReplaceEventsForOpportunity, showToast,
}) {
  const isAr = lang === 'ar';
  const isAdmin = currentUser.role === 'Admin';
  const [mode, setMode] = useState(null); // null | 'add' | opp object
  const [tab, setTab] = useState('opps'); // opps | stats | users
  const manageable = filterManageable(currentUser, opportunities);

  const handleSave = (opp, calendarEvents) => {
    if (mode === 'add') {
      const created = onAdd(opp);
      if (calendarEvents?.length) {
        onReplaceEventsForOpportunity(created.id, calendarEvents);
      }
    } else {
      onUpdate(opp);
      onReplaceEventsForOpportunity(opp.id, calendarEvents || []);
    }
    setMode(null);
  };

  const handleDelete = opp => {
    if (window.confirm(pick(isAr, 'למחוק הזדמנות זו?', 'حذف هذه الفرصة؟'))) onDelete(opp.id);
  };

  const t = (he, ar) => pick(isAr, he, ar);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-black text-gray-800 mb-1">{t('⚙️ ממשק ניהול', '⚙️ لوحة الإدارة')}</h1>
      <p className="text-gray-500 text-sm mb-6">{t(`שלום ${currentUser.name}`, `مرحباً ${currentUser.name}`)}</p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: 'opps',   labelHe: 'הזדמנויות',    labelAr: 'الفرص'       },
          { key: 'stats',  labelHe: 'סטטיסטיקות',   labelAr: 'إحصائيات'   },
          ...(isAdmin ? [{ key: 'users', labelHe: 'משתמשים 👤', labelAr: 'المستخدمون 👤' }] : []),
        ].map(({ key, labelHe, labelAr }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
              ${tab === key ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-emerald-50'}`}>
            {isAr ? labelAr : labelHe}
          </button>
        ))}
      </div>

      {tab === 'opps' && (
        <>
          {!mode && (
            <button onClick={() => setMode('add')}
              className="mb-4 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700">
              + {t('הוסף הזדמנות', 'أضف فرصة')}
            </button>
          )}
          {mode && (
            <div className="mb-6">
              <OpportunityForm
                lang={lang} user={currentUser}
                initial={mode === 'add' ? null : mode}
                onSave={handleSave}
                onCancel={() => setMode(null)}
              />
            </div>
          )}
          <div className="space-y-3">
            {manageable.map(o => (
              <div key={o.id} className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-gray-800">{isAr ? o.titleAr : o.title}</p>
                  <p className="text-xs text-gray-500">{o.city} · {getOrgName(o.organizationId, isAr)}</p>
                </div>
                {canManageOpportunity(currentUser, o) && (
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button onClick={() => setMode(o)} className="text-xs px-3 py-2.5 sm:py-1.5 min-h-[44px] sm:min-h-0 w-full sm:w-auto bg-gray-100 rounded-lg hover:bg-emerald-50">
                      {t('ערוך', 'تعديل')}
                    </button>
                    <button onClick={() => handleDelete(o)} className="text-xs px-3 py-2.5 sm:py-1.5 min-h-[44px] sm:min-h-0 w-full sm:w-auto bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                      {t('מחק', 'حذف')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}


      {tab === 'stats' && (
        <StatsDashboard
          opportunities={opportunities}
          registrations={registrations}
          cancellations={cancellations}
          views={views}
          profiles={profiles}
          lang={lang}
          showToast={showToast}
        />
      )}

      {tab === 'users' && isAdmin && (
        <UserManagement
          lang={lang}
          currentUser={currentUser}
          showToast={showToast}
        />
      )}

    </div>
  );
}

export default StaffPanel;
