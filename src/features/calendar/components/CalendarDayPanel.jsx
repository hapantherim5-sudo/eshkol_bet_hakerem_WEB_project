import { getCityName, getOrgName } from '../../../data/organizations';
import { formatIsraeliDate } from '../../../utils/israeliDate';

export default function CalendarDayPanel({ lang, selectedDate, opportunities, totalActivities, onOpenOpportunity, onNavigate, t }) {
  const isArabic = lang === 'ar';
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-black text-gray-700 sm:text-base">📆 {t('calendar_day_title', { date: formatIsraeliDate(selectedDate) })}</h2>
        {!opportunities.length ? <div className="py-10 text-center text-gray-400"><p className="mb-3 text-4xl">🗓️</p><p className="text-sm font-medium">{t('calendar_no_events_day')}</p></div> : <ul className="space-y-3">{opportunities.map(opportunity => <li key={opportunity.calendarEntryId || opportunity.id} className="rounded-2xl border-2 border-gray-100 p-3.5 transition hover:border-emerald-200"><div className="flex items-start gap-2.5"><span className="shrink-0 text-2xl">{opportunity.icon || '📌'}</span><div className="min-w-0 flex-1"><p className="text-sm font-bold text-gray-800 sm:text-base">{isArabic ? opportunity.titleAr : opportunity.title}</p><div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">{opportunity.startTime && <span>🕐 {opportunity.startTime}{opportunity.endTime ? `–${opportunity.endTime}` : ''}</span>}<span>📍 {getCityName(opportunity.city, isArabic)}</span><span>{getOrgName(opportunity.organizationId, isArabic)}</span></div><button onClick={() => onOpenOpportunity?.(opportunity)} className="mt-2 min-h-[36px] rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">{t('calendar_opportunity_details')} →</button></div></div></li>)}</ul>}
      </div>
      {totalActivities < 3 && <div className="home-login-cta rounded-2xl p-5 text-white"><p className="mb-1 text-base font-black">🚀 {t(totalActivities === 1 ? 'calendar_few_summary_one' : 'calendar_few_summary_many', { count: totalActivities })}</p><p className="mb-4 text-sm leading-relaxed text-white/80">{t('calendar_few_description')}</p><button onClick={() => onNavigate?.('opportunities')} className="rounded-xl bg-white px-5 py-2.5 text-sm font-black text-[#6c4e9b]">🔍 {t('calendar_explore')}</button></div>}
    </div>
  );
}
