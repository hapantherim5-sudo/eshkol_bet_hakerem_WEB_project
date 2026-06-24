import { useLayoutEffect, useRef, useState } from 'react';
import { filterManageable, canManageOpportunity } from '../../utils/permissions';
import { getOrgName } from '../../data/organizations';
import { getCityName } from '../../data/opportunitiesSeed';
import { pick } from '../../i18n/i18n';
import OpportunityForm from './OpportunityForm';
import UserManagement from './UserManagement';
import StatsDashboard from './StatsDashboard';

function StaffPanel({
  lang, currentUser, opportunities, views, registrations, cancellations, profiles,
  onAdd, onUpdate, onDelete, onReplaceEventsForOpportunity, showToast,
}) {
  const isAr = lang === 'ar';
  const isAdmin = currentUser.role === 'Admin';
  const [mode, setMode] = useState(null); // null | 'add' | opp object
  const [tab, setTab] = useState('opps'); // opps | stats | users
  const [opportunityQuery, setOpportunityQuery] = useState('');
  const [formWindowTop, setFormWindowTop] = useState(0);
  const toolbarRef = useRef(null);
  const manageable = filterManageable(currentUser, opportunities);
  const normalizedQuery = opportunityQuery.trim().toLowerCase();
  const visibleOpportunities = normalizedQuery
    ? manageable.filter(opp => [
      opp.title,
      opp.titleAr,
      opp.city,
      getCityName(opp.city, true),
      opp.category,
      opp.categoryLabel,
      getOrgName(opp.organizationId, false),
      getOrgName(opp.organizationId, true),
    ].some(value => String(value ?? '').toLowerCase().includes(normalizedQuery)))
    : manageable;

  useLayoutEffect(() => {
    if (!mode) return undefined;
    const positionFormWindow = () => {
      const toolbarBottom = toolbarRef.current?.getBoundingClientRect().bottom ?? 96;
      setFormWindowTop(Math.round(toolbarBottom + 12));
    };
    positionFormWindow();
    window.addEventListener('resize', positionFormWindow);
    return () => window.removeEventListener('resize', positionFormWindow);
  }, [mode]);

  const handleSave = async (opp, calendarEvents) => {
    try {
      if (mode === 'add') {
        const created = await onAdd(opp);
        if (calendarEvents?.length) {
          await onReplaceEventsForOpportunity(created.id, calendarEvents);
        }
      } else {
        await onUpdate(opp);
        await onReplaceEventsForOpportunity(opp.id, calendarEvents || []);
      }
      setMode(null);
    } catch {
      showToast(t('שמירת ההזדמנות נכשלה, נסה שוב', 'تعذر حفظ الفرصة، حاول مرة أخرى'), 'error');
    }
  };

  const handleDelete = opp => {
    if (window.confirm(pick(isAr, 'למחוק הזדמנות זו?', 'حذف هذه الفرصة؟'))) onDelete(opp.id);
  };

  const handleTabChange = (nextTab) => {
    setMode(null);
    setTab(nextTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const t = (he, ar) => pick(isAr, he, ar);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      <div ref={toolbarRef} className={`admin-toolbar -mx-2 mb-6 rounded-2xl border border-gray-100 bg-white/95 p-4 shadow-lg shadow-slate-900/5 backdrop-blur-xl
        ${tab === 'opps' ? 'sticky top-24 z-30' : ''}`}>
        <h1 className="text-xl sm:text-2xl font-black text-gray-800 mb-1">{t('⚙️ ממשק ניהול', '⚙️ لوحة الإدارة')}</h1>
        <p className="text-gray-500 text-sm mb-4">{t(`שלום ${currentUser.name}`, `مرحباً ${currentUser.name}`)}</p>

        <div className="flex gap-2 flex-wrap items-center">
          {[
            { key: 'opps',   labelHe: 'הזדמנויות',    labelAr: 'الفرص'       },
            { key: 'stats',  labelHe: 'סטטיסטיקות',   labelAr: 'إحصائيات'   },
            ...(isAdmin ? [{ key: 'users', labelHe: 'משתמשים 👤', labelAr: 'المستخدمون 👤' }] : []),
          ].map(({ key, labelHe, labelAr }) => (
            <button key={key} onClick={() => handleTabChange(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition
                ${tab === key ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-emerald-50'}`}>
              {isAr ? labelAr : labelHe}
            </button>
          ))}

          {!mode && (
            <button onClick={() => { setTab('opps'); setMode('add'); }}
              className="mr-auto px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700">
              + {t('הוסף הזדמנות', 'أضف فرصة')}
            </button>
          )}
        </div>

        {tab === 'opps' && (
          <div className="relative mt-3">
            <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="6" />
              <path d="m16 16 4 4" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={opportunityQuery}
              onChange={event => setOpportunityQuery(event.target.value)}
              placeholder={t('חיפוש לפי שם, יישוב, קטגוריה או ארגון...', 'ابحث بالاسم أو البلدة أو الفئة أو الجهة...')}
              aria-label={t('חיפוש הזדמנויות', 'البحث عن فرص')}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pr-9 pl-9 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            {opportunityQuery && (
              <button
                type="button"
                onClick={() => setOpportunityQuery('')}
                aria-label={t('נקה חיפוש', 'مسح البحث')}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-gray-200 hover:text-gray-700">
                ×
              </button>
            )}
          </div>
        )}
      </div>

      {mode && (
        <>
          <div className="fixed inset-0 z-10 bg-slate-950/20 backdrop-blur-[1px]" />
          <div
            role="dialog"
            aria-label={t('טופס הזדמנות', 'نموذج فرصة')}
            className="fixed inset-x-3 bottom-4 z-20 mx-auto max-w-5xl overflow-y-auto rounded-2xl shadow-2xl"
            style={{ top: formWindowTop }}>
            <OpportunityForm
              lang={lang} user={currentUser}
              initial={mode === 'add' ? null : mode}
              onSave={handleSave}
              onCancel={() => setMode(null)}
            />
          </div>
        </>
      )}

      {tab === 'opps' && (
        <>
          <div className="space-y-3">
            {visibleOpportunities.map(o => (
              <div key={o.id} className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-gray-800">{isAr ? o.titleAr : o.title}</p>
                  <p className="text-xs text-gray-500">{getCityName(o.city, isAr)} · {getOrgName(o.organizationId, isAr)}</p>
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
            {visibleOpportunities.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
                {t('לא נמצאו הזדמנויות התואמות לחיפוש.', 'لم يتم العثور على فرص مطابقة للبحث.')}
              </div>
            )}
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
