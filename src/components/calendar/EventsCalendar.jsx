import { useState } from 'react';
import { getMonthGrid, dateKey, eventsOnDay } from '../../lib/utils/calendar';
import { getOrgName } from '../../data/organizations';
import { pick } from '../../lib/i18n/i18n';
import { formatIsraeliDate } from '../../lib/utils/israeliDate';

const WEEK_HE = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
const WEEK_AR = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];

function EventsCalendar({ events, lang, opportunities, onOpenOpp }) {
  const isAr = lang === 'ar';
  const t = (he, ar) => pick(isAr, he, ar);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState(now.getDate());

  const grid = getMonthGrid(year, month);
  const monthLabel = new Date(year, month).toLocaleDateString(isAr ? 'ar' : 'he', { month: 'long', year: 'numeric' });
  const key = selectedDay ? dateKey(year, month, selectedDay) : null;
  const dayEvents = key ? eventsOnDay(events, key) : [];
  const isToday = day =>
    year === now.getFullYear() && month === now.getMonth() && day === now.getDate();

  const shiftMonth = delta => {
    let m = month + delta;
    let y = year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setMonth(m);
    setYear(y);
    setSelectedDay(1);
  };

  const findOpp = id => opportunities.find(o => o.id === id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-black text-gray-800 mb-6">{t('📅 לוח אירועים', '📅 تقويم الأحداث')}</h1>

      {/* Mobile: stack calendar and events; lg: side by side */}
      <div className="grid lg:grid-cols-2 gap-6 items-start">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2 mb-4">
          <button onClick={() => shiftMonth(-1)} className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-gray-100 hover:bg-emerald-50 min-h-[44px]">
            {t('חודש קודם', 'الشهر السابق')}
          </button>
          <span className="font-bold text-gray-800 text-sm sm:text-base text-center">{monthLabel}</span>
          <button onClick={() => shiftMonth(1)} className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-gray-100 hover:bg-emerald-50 min-h-[44px]">
            {t('חודש הבא', 'الشهر التالي')}
          </button>
        </div>
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center text-xs text-gray-500 mb-1">
          {(isAr ? WEEK_AR : WEEK_HE).map(d => <span key={d}>{d}</span>)}
        </div>
        {/* Mobile: tighter day cells for 320px width */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
          {grid.map((day, i) => {
            if (!day) return <div key={`e-${i}`} />;
            const dk = dateKey(year, month, day);
            const has = eventsOnDay(events, dk).length > 0;
            const sel = day === selectedDay;
            const today = isToday(day);
            return (
              <button key={dk} onClick={() => setSelectedDay(day)}
                className={`aspect-square rounded-lg text-xs sm:text-sm flex flex-col items-center justify-center transition min-h-[36px]
                  ${sel ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-emerald-50 text-gray-800'}
                  ${today && !sel ? 'ring-2 ring-emerald-600 bg-emerald-50 font-black text-emerald-800' : ''}
                  ${today && sel ? 'ring-2 ring-emerald-300 ring-offset-1' : ''}
                  ${has && !sel && !today ? 'ring-2 ring-emerald-300' : ''}`}>
                {day}
                {has && <span className={`w-1 h-1 rounded-full mt-0.5 ${sel ? 'bg-white' : 'bg-emerald-500'}`} />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
        <h2 className="font-bold text-gray-700 mb-3 text-sm sm:text-base">
          {t(
            `אירועים ב-${formatIsraeliDate(dateKey(year, month, selectedDay))}`,
            `أحداث ${formatIsraeliDate(dateKey(year, month, selectedDay))}`,
          )}
        </h2>
        {dayEvents.length === 0 ? (
          <p className="text-gray-400 text-sm">{t('אין אירועים ביום זה', 'لا أحداث في هذا اليوم')}</p>
        ) : (
          <ul className="space-y-3">
            {dayEvents.map(ev => {
              const opp = ev.opportunityId ? findOpp(ev.opportunityId) : null;
              return (
                <li key={ev.id} className="border border-gray-100 rounded-xl p-3">
                  <p className="font-medium text-gray-800 text-sm sm:text-base">{isAr ? ev.titleAr : ev.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {ev.startsAt?.slice(11, 16)} · {ev.city} · {getOrgName(ev.organizationId, isAr)}
                  </p>
                  {opp && (
                    <button onClick={() => onOpenOpp(opp)}
                      className="text-xs text-emerald-700 mt-2 underline min-h-[44px] inline-flex items-center">
                      {t('פרטי הזדמנות', 'تفاصيل الفرصة')}
                    </button>
                  )}
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
