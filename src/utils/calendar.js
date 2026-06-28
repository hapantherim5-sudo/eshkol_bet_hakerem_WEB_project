// File: src/utils/calendar.js
// Purpose: calendar script
// Role: utility module for calendar

export function getMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0).getDate();
  const startPad = first.getDay(); // Sun=0
  const cells = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= lastDay; d++) cells.push(d);
  return cells;
}

// dateKey — handles dateKey
export function dateKey(year, month, day) {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

/**
 * Build the dated entries displayed in the personal calendar.
 * Generated event documents are preferred, while opportunity.eventDate remains
 * a fallback for older records that predate the admin event workflow.
 */
export function buildRegisteredCalendarEntries(
  opportunities = [],
  events = [],
  registeredOpportunityIds = new Set(),
) {
  const registeredIds = new Set(
    [...registeredOpportunityIds].map(id => String(id)),
  );
  const eventsByOpportunity = new Map();

  events.forEach(event => {
    const opportunityId = String(event.opportunityId);
    if (!registeredIds.has(opportunityId) || !event.startsAt) return;

    const startsAt = new Date(event.startsAt);
    if (Number.isNaN(startsAt.getTime())) return;

    const entries = eventsByOpportunity.get(opportunityId) || [];
    entries.push({ event, startsAt });
    eventsByOpportunity.set(opportunityId, entries);
  });

  return opportunities.flatMap(opportunity => {
    const opportunityId = String(opportunity.id);
    if (!registeredIds.has(opportunityId)) return [];

    const generatedEvents = eventsByOpportunity.get(opportunityId) || [];
    if (generatedEvents.length) {
      return generatedEvents.map(({ event, startsAt }, index) => ({
        ...opportunity,
        calendarEntryId: `event-${event.id ?? opportunity.id}-${index}`,
        eventDate: dateKey(
          startsAt.getFullYear(),
          startsAt.getMonth(),
          startsAt.getDate(),
        ),
        startTime: `${String(startsAt.getHours()).padStart(2, '0')}:${String(
          startsAt.getMinutes(),
        ).padStart(2, '0')}`,
        endTime: event.endTime || opportunity.endTime || '',
      }));
    }

    return opportunity.eventDate
      ? [{
          ...opportunity,
          calendarEntryId: `opportunity-${opportunity.id}-${opportunity.eventDate}`,
        }]
      : [];
  });
}

