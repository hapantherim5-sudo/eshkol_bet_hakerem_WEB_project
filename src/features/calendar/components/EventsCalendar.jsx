import { useState } from 'react';
import { getMonthGrid, dateKey } from '../../../utils/calendar';
import { useT } from '../../../i18n/i18n';
import CalendarDayPanel from './CalendarDayPanel';
import CalendarEmptyState from './CalendarEmptyState';
import CalendarGrid from './CalendarGrid';

export default function EventsCalendar({ lang, opportunities, onOpenOpp, onNavigate, currentUser, registrations }) {
  const t = useT(lang);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState(now.getDate());

  const registeredIds = new Set(
    (registrations || []).filter(item => item.userId === currentUser?.id).map(item => item.opportunityId)
  );
  const userOpportunities = (opportunities || []).filter(
    opportunity => registeredIds.has(opportunity.id) && opportunity.eventDate
  );

  if (!currentUser || !userOpportunities.length) {
    return <CalendarEmptyState currentUser={currentUser} onNavigate={onNavigate} t={t} />;
  }

  const selectedDate = dateKey(year, month, selectedDay);
  const selectedOpportunities = userOpportunities.filter(item => item.eventDate === selectedDate);
  const today = dateKey(now.getFullYear(), now.getMonth(), now.getDate());
  const upcoming = userOpportunities.filter(item => item.eventDate >= today).length;
  const monthLabel = new Date(year, month).toLocaleDateString(lang === 'ar' ? 'ar' : 'he', {
    month: 'long', year: 'numeric',
  });

  const shiftMonth = delta => {
    const nextDate = new Date(year, month + delta, 1);
    setYear(nextDate.getFullYear());
    setMonth(nextDate.getMonth());
    setSelectedDay(1);
  };

  return (
    <div className="mx-auto max-w-6xl animate-fade-in px-4 py-6 sm:py-8">
      <header className="mb-6">
        <h1 className="mb-2 text-2xl font-black text-gray-800 sm:text-3xl">📅 {t('calendar_personal_title', { name: currentUser.name })}</h1>
        <div className="flex flex-wrap items-center gap-2"><span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">✅ {userOpportunities.length} {t('calendar_registered_count')}</span>{upcoming > 0 && <span className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">⏳ {upcoming} {t('calendar_upcoming_count')}</span>}</div>
      </header>
      <div className="grid items-start gap-5 lg:grid-cols-2">
        <CalendarGrid
          year={year}
          month={month}
          selectedDay={selectedDay}
          days={getMonthGrid(year, month)}
          opportunities={userOpportunities}
          monthLabel={monthLabel}
          onSelectDay={setSelectedDay}
          onShiftMonth={shiftMonth}
          t={t}
        />
        <CalendarDayPanel
          lang={lang}
          selectedDate={selectedDate}
          opportunities={selectedOpportunities}
          totalActivities={userOpportunities.length}
          onOpenOpportunity={onOpenOpp}
          onNavigate={onNavigate}
          t={t}
        />
      </div>
    </div>
  );
}
