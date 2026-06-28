import { dateKey } from '../../../utils/calendar';

export default function CalendarGrid({ year, month, selectedDay, days, opportunities, monthLabel, onSelectDay, onShiftMonth, t }) {
  const now = new Date();
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex items-center justify-between gap-2"><NavButton onClick={() => onShiftMonth(-1)}>{t('calendar_previous')}</NavButton><span className="px-2 text-center text-sm font-black text-gray-800 sm:text-base">{monthLabel}</span><NavButton onClick={() => onShiftMonth(1)}>{t('calendar_next')}</NavButton></div>
      <div className="mb-2 grid grid-cols-7 gap-0.5 text-center sm:gap-1">{t('calendar_weekdays_short').map(day => <span key={day} className="py-1 text-xs font-bold text-gray-400">{day}</span>)}</div>
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">{days.map((day, index) => {
        if (!day) return <div key={`empty-${index}`} />;
        const key = dateKey(year, month, day);
        const count = opportunities.filter(item => item.eventDate === key).length;
        const selected = day === selectedDay;
        const today = year === now.getFullYear() && month === now.getMonth() && day === now.getDate();
        return <button key={key} onClick={() => onSelectDay(day)} className={`relative flex aspect-square min-h-[36px] flex-col items-center justify-center rounded-xl text-xs font-semibold transition sm:text-sm ${selected ? 'scale-105 bg-emerald-600 text-white shadow-md' : today ? 'bg-emerald-50 font-black text-emerald-700 ring-2 ring-emerald-400' : 'text-gray-700 hover:bg-emerald-50'}`}>{day}{count > 0 && <span className={`mt-0.5 h-1.5 w-1.5 rounded-full ${selected ? 'bg-white' : 'bg-emerald-500'}`} />}{count > 1 && <span className="absolute top-0.5 left-0.5 rounded-full bg-emerald-100 px-1 text-[9px] font-black text-emerald-700">{count}</span>}</button>;
      })}</div>
    </div>
  );
}

function NavButton({ onClick, children }) {
  return <button onClick={onClick} className="min-h-[40px] rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-emerald-50 hover:text-emerald-700">{children}</button>;
}
