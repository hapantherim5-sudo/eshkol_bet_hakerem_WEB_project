import { useState } from 'react';
import { getMonthGrid, dateKey, eventsOnDay } from '../../utils/calendar';
import { getOrgName } from '../../data/organizations';
import { pick } from '../../i18n/i18n';
import { formatIsraeliDate } from '../../utils/israeliDate';

const WEEK_HE = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
const WEEK_AR = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];

function EventsCalendar({ events, lang, opportunities, onOpenOpp, currentUser, registrations }) {
  const isAr = lang === 'ar';
  const t = (he, ar) => pick(isAr, he, ar);
  const now = new Date();
  const [year,        setYear]        = useState(now.getFullYear());
  const [month,       setMonth]       = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState(now.getDate());

  const registeredOppIds = new Set(
    (registrations ?? [])
      .filter(r => r.userId === currentUser?.id)
      .map(r => r.opportunityId)
  );
  const userEvents = events.filter(e => e.opportunityId && registeredOppIds.has(e.opportunityId));

  const grid       = getMonthGrid(year, month);
  const monthLabel = new Date(year, month).toLocaleDateString(isAr ? 'ar' : 'he', { month: 'long', year: 'numeric' });
  const key        = selectedDay ? dateKey(year, month, selectedDay) : null;
  const dayEvents  = key ? eventsOnDay(userEvents, key) : [];
  const isToday    = day => year === now.getFullYear() && month === now.getMonth() && day === now.getDate();

  const shiftMonth = delta => {
    let m = month + delta;
    let y = year;
    if (m < 0)  { m = 11; y--; }
    if (m > 11) { m = 0;  y++; }
    setMonth(m);
    setYear(y);
    setSelectedDay(1);
  };

  const findOpp = id => opportunities.find(o => o.id === id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-black text-gray-800 mb-6">
        📅 {t('לוח אירועים', 'تقويم الأحداث')}
      </h1>

      <div className="grid lg:grid-cols-2 gap-5 items-start">

        {/* Calendar */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-5">
          {/* Month navigation */}
          <div className="flex items-center justify-between gap-2 mb-5">
            <button
              onClick={() => shiftMonth(-1)}
              className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-600
                bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition min-h-[40px]">
              {t('◄ קודם', '◄ السابق')}
            </button>
            <span className="font-black text-gray-800 text-sm sm:text-base text-center px-2">{monthLabel}</span>
            <button
              onClick={() => shiftMonth(1)}
              className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-600
                bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition min-h-[40px]">
              {t('הבא ►', 'التالي ►')}
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center mb-2">
            {(isAr ? WEEK_AR : WEEK_HE).map(d => (
              <span key={d} className="text-xs font-bold text-gray-400 py-1">{d}</span>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
            {grid.map((day, i) => {
              if (!day) return <div key={`e-${i}`} />;
              const dk    = dateKey(year, month, day);
              const has   = eventsOnDay(userEvents, dk).length > 0;
              const sel   = day === selectedDay;
              const today = isToday(day);
              return (
                <button key={dk} onClick={() => setSelectedDay(day)}
                  className={`aspect-square rounded-xl text-xs sm:text-sm flex flex-col items-center
                    justify-center transition-all duration-150 min-h-[36px] font-semibold
                    ${sel
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100 scale-105'
                      : today
                        ? 'bg-emerald-50 text-emerald-700 ring-2 ring-emerald-400 font-black'
                        : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'}
                    ${has && !sel ? 'font-bold' : ''}`}>
                  {day}
                  {has && (
                    <span className={`w-1.5 h-1.5 rounded-full mt-0.5
                      ${sel ? 'bg-white' : 'bg-emerald-500'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Events panel */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-5
          lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
          <h2 className="font-black text-gray-700 mb-4 text-sm sm:text-base flex items-center gap-2">
            <span className="text-base">📆</span>
            {t(
              `אירועים — ${formatIsraeliDate(dateKey(year, month, selectedDay))}`,
              `أحداث — ${formatIsraeliDate(dateKey(year, month, selectedDay))}`,
            )}
          </h2>

          {dayEvents.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-3">🗓️</p>
              <p className="text-sm font-medium">{t('אין לך אירועים רשומים ביום זה', 'لا أحداث مسجلة لك في هذا اليوم')}</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {dayEvents.map(ev => {
                const opp = ev.opportunityId ? findOpp(ev.opportunityId) : null;
                return (
                  <li key={ev.id}
                    className="border-2 border-gray-100 hover:border-emerald-200 rounded-2xl p-3.5
                      transition-all duration-150 hover:bg-emerald-50/30">
                    <div className="flex items-start gap-2.5">
                      <span className="text-2xl leading-none mt-0.5">{opp?.icon ?? '📌'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 text-sm sm:text-base leading-snug">
                          {isAr ? ev.titleAr : ev.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5 flex-wrap">
                          <span>🕐 {ev.startsAt?.slice(11, 16)}</span>
                          <span>·</span>
                          <span>📍 {ev.city}</span>
                          <span>·</span>
                          <span>{getOrgName(ev.organizationId, isAr)}</span>
                        </p>
                        {opp && (
                          <button
                            onClick={() => onOpenOpp(opp)}
                            className="mt-2 text-xs font-bold text-emerald-700 bg-emerald-50
                              hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition min-h-[36px]
                              inline-flex items-center gap-1">
                            {t('פרטי הזדמנות', 'تفاصيل الفرصة')} →
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default EventsCalendar;
