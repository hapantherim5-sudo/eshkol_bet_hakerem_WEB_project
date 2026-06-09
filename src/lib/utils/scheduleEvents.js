const WEEKDAY_NAMES = [
  ['ראשון', 0],
  ['שני', 1],
  ['שלישי', 2],
  ['רביעי', 3],
  ['חמישי', 4],
  ['שישי', 5],
  ['שבת', 6],
];

/** @returns {number[] | null} null = כל ימי השבוע */
export function parseWeekdays(daysStr) {
  if (!daysStr?.trim()) return null;
  const found = new Set();
  for (const [name, day] of WEEKDAY_NAMES) {
    if (daysStr.includes(name)) found.add(day);
  }
  return found.size ? [...found] : null;
}

export function parseStartTime(timeStr) {
  if (!timeStr?.trim()) return '09:00';
  const part = timeStr.trim().split(/[-–]/)[0].trim();
  const m = part.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return '09:00';
  return `${m[1].padStart(2, '0')}:${m[2]}`;
}

function dateKeyLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseDateOnly(str) {
  if (!str) return null;
  const d = new Date(`${str}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * יוצר רשימת אירועי לוח שנה לפי טווח תאריכים, ימים בשבוע ושעת התחלה.
 * @returns {{ title, titleAr, organizationId, city, startsAt: string }[]}
 */
export function buildCalendarEvents(opp) {
  const { startDate, endDate, days, time, title, titleAr, organizationId, city } = opp;
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);
  if (!start || !end || end < start) return [];

  const weekdays = parseWeekdays(days);
  const startTime = parseStartTime(time);
  const events = [];

  const cursor = new Date(start);
  while (cursor <= end) {
    const dow = cursor.getDay();
    const include = weekdays === null || weekdays.includes(dow);
    if (include) {
      const key = dateKeyLocal(cursor);
      const startsAt = new Date(`${key}T${startTime}:00`).toISOString();
      events.push({ title, titleAr, organizationId, city, startsAt });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return events;
}
