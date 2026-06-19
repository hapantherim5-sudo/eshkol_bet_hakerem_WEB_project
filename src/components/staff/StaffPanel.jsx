import { useState } from 'react';
import { filterManageable, canManageOpportunity } from '../../utils/permissions';
import { getOrgName } from '../../data/organizations';
import { computeStats } from '../../utils/analytics';
import { pick } from '../../i18n/i18n';
import { formatIsraeliDateTime } from '../../utils/israeliDate';
import ConfirmModal from '../ConfirmModal';
import OpportunityForm from './OpportunityForm';

function StaffPanel({
  lang, currentUser, opportunities, events, views, registrations, cancellations, profiles,
  onAdd, onUpdate, onDelete, onAddEvent, onDeleteEvent, onReplaceEventsForOpportunity,
}) {
  const isAr = lang === 'ar';
  const [mode, setMode] = useState(null); // null | 'add' | opp object
  const [tab, setTab] = useState('opps'); // opps | stats | events
  const [eventForm, setEventForm] = useState({ title: '', titleAr: '', organizationId: '', city: '', startsAt: '' });
  const [eventToDelete, setEventToDelete] = useState(null);

  const manageable = filterManageable(currentUser, opportunities);
  const stats = computeStats({ opportunities, views, registrations, cancellations, profiles });

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

  const confirmDeleteEvent = () => {
    if (!eventToDelete) return;
    onDeleteEvent(eventToDelete.id);
    setEventToDelete(null);
  };

  const staffEvents = currentUser.role === 'Admin'
    ? events
    : events.filter(e => e.organizationId === currentUser.organizationId);

  const addStandaloneEvent = () => {
    if (!eventForm.title || !eventForm.startsAt) return;
    onAddEvent({
      ...eventForm,
      organizationId: eventForm.organizationId || currentUser.organizationId,
      startsAt: new Date(eventForm.startsAt).toISOString(),
    });
    setEventForm({ title: '', titleAr: '', organizationId: '', city: '', startsAt: '' });
  };

  const t = (he, ar) => pick(isAr, he, ar);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-black text-gray-800 mb-1">{t('⚙️ ממשק ניהול', '⚙️ لوحة الإدارة')}</h1>
      <p className="text-gray-500 text-sm mb-6">{t(`שלום ${currentUser.name}`, `مرحباً ${currentUser.name}`)}</p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['opps', 'events', 'stats'].map(key => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
              ${tab === key ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-emerald-50'}`}>
            {key === 'opps' ? t('הזדמנויות', 'الفرص') : key === 'events' ? t('אירועים', 'الأحداث') : t('סטטיסטיקות', 'إحصائيات')}
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

      {tab === 'events' && (
        <div>
          <div className="bg-white rounded-xl border p-4 mb-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            <input placeholder={t('כותרת', 'العنوان')} className="px-3 py-2 border rounded-lg text-sm"
              value={eventForm.title} onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))} />
            <input type="datetime-local" className="px-3 py-2 border rounded-lg text-sm"
              value={eventForm.startsAt} onChange={e => setEventForm(f => ({ ...f, startsAt: e.target.value }))} />
            <input placeholder={t('יישוב', 'البلدة')} className="px-3 py-2 border rounded-lg text-sm"
              value={eventForm.city} onChange={e => setEventForm(f => ({ ...f, city: e.target.value }))} />
            <button onClick={addStandaloneEvent} className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg">
              + {t('הוסף אירוע', 'أضف حدث')}
            </button>
          </div>
          {staffEvents.map(e => (
            <div key={e.id} className="bg-white rounded-xl border p-3 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-sm">{isAr ? e.titleAr : e.title} — {formatIsraeliDateTime(e.startsAt)}</span>
              <button onClick={() => setEventToDelete(e)} className="text-xs text-red-600 min-h-[44px] sm:min-h-0 self-start sm:self-center">{t('מחק', 'حذف')}</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'stats' && (
        <div>
          {/* Mobile: one KPI per row; md: four columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { n: stats.userCount, l: t('משתמשים', 'المستخدمون') },
              { n: stats.totalViews, l: t('צפיות', 'المشاهدات') },
              { n: stats.totalRegistrations, l: t('הרשמות', 'التسجيلات') },
              { n: opportunities.length, l: t('הזדמנויות', 'الفرص') },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border text-center">
                <p className="text-2xl font-black text-emerald-700">{s.n}</p>
                <p className="text-xs text-gray-500">{s.l}</p>
              </div>
            ))}
          </div>
          <h3 className="font-bold text-gray-700 mb-2">{t('מובילות לפי הרשמות', 'الأكثر تسجيلاً')}</h3>
          {/* Mobile: horizontal scroll for wide table */}
          <div className="bg-white rounded-xl border overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full text-sm min-w-[480px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right p-2">{t('פעילות', 'النشاط')}</th>
                  <th className="p-2">{t('הרשמות', 'تسجيل')}</th>
                  <th className="p-2">{t('ביטולים', 'إلغاءات')}</th>
                  <th className="p-2">{t('צפיות', 'مشاهدة')}</th>
                </tr>
              </thead>
              <tbody>
                {stats.topOpps.map(row => (
                  <tr key={row.id} className="border-t">
                    <td className="p-2">{row.title}</td>
                    <td className="p-2 text-center">{row.registrations}</td>
                    <td className="p-2 text-center">{row.cancellations}</td>
                    <td className="p-2 text-center">{row.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {eventToDelete && (
        <ConfirmModal
          lang={lang}
          titleHe="מחיקת אירוע"
          titleAr="حذف الحدث"
          messageHe={`האם אתה בטוח שברצונך למחוק את האירוע "${eventToDelete.title}"?`}
          messageAr={`هل أنت متأكد أنك تريد حذف الحدث "${eventToDelete.titleAr || eventToDelete.title}"؟`}
          confirmHe="כן, מחק"
          confirmAr="نعم، حذف"
          danger
          onConfirm={confirmDeleteEvent}
          onClose={() => setEventToDelete(null)}
        />
      )}
    </div>
  );
}

export default StaffPanel;
