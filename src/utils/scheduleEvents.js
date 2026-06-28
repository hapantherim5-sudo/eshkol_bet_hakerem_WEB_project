// File: src/utils/scheduleEvents.js
// Purpose: scheduleEvents script
// Role: utility module for scheduleEvents

import he from '../i18n/he.js';

const WEEKDAY_NAMES = [
  [he.weekday_sunday, 0],
  [he.weekday_monday, 1],
  [he.weekday_tuesday, 2],
  [he.weekday_wednesday, 3],
  [he.weekday_thursday, 4],
  [he.weekday_friday, 5],
  [he.weekday_saturday, 6],
];

// parseWeekdays — handles parseWeekdays
export function parseWeekdays(daysStr) {
  // No weekday specified means the activity repeats every day.
  if (!daysStr?.trim()) return null;
  const found = new Set();
  for (const [name, day] of WEEKDAY_NAMES) {
    if (daysStr.includes(name)) found.add(day);
  }
  return found.size ? [...found] : null;
}

// parseStartTime — handles parseStartTime
export function parseStartTime(timeStr) {
  if (!timeStr?.trim()) return '09:00';
  const part = timeStr.trim().split(/[-–]/)[0].trim();
  const m = part.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return '09:00';
  return `${m[1].padStart(2, '0')}:${m[2]}`;
}

// dateKeyLocal — handles dateKeyLocal
function dateKeyLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// parseDateOnly — handles parseDateOnly
function parseDateOnly(str) {
  if (!str) return null;
  // Noon prevents timezone offsets from moving a date-only value to the previous day.
  const d = new Date(`${str}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

// buildCalendarEvents — handles buildCalendarEvents
export function buildCalendarEvents(opp) {
  const {
    startDate,
    endDate,
    days,
    time,
    endTime,
    title,
    titleAr,
    organizationId,
    city,
  } = opp;
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);
  if (!start || !end || end < start) return [];

  const weekdays = parseWeekdays(days);
  const startTime = parseStartTime(time);
  const events = [];

  // Include each matching date from the start date through the end date.
  const cursor = new Date(start);
  while (cursor <= end) {
    const dow = cursor.getDay();
    const include = weekdays === null || weekdays.includes(dow);
    if (include) {
      const key = dateKeyLocal(cursor);
      const startsAt = new Date(`${key}T${startTime}:00`).toISOString();
      events.push({ title, titleAr, organizationId, city, startsAt, endTime });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return events;
}
