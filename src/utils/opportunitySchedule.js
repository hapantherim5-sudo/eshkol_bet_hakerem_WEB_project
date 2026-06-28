import { formatIsraeliDate } from './israeliDate.js';

function timeParts(value) {
  const match = String(value || '').match(
    /(\d{1,2}):(\d{2})(?:\s*[-–]\s*(\d{1,2}):(\d{2}))?/,
  );
  if (!match) return { startTime: '', endTime: '' };

  return {
    startTime: `${match[1].padStart(2, '0')}:${match[2]}`,
    endTime: match[3] ? `${match[3].padStart(2, '0')}:${match[4]}` : '',
  };
}

/**
 * Normalize legacy opportunity schedule fields and the current Admin form
 * fields into one display shape shared by cards and modals.
 */
export function getOpportunityDisplaySchedule(opportunity = {}) {
  const parsedTime = timeParts(opportunity.time);
  const startDate = opportunity.eventDate || opportunity.startDate || '';
  const endDate = !opportunity.eventDate
    && opportunity.endDate
    && opportunity.endDate !== startDate
    ? opportunity.endDate
    : '';
  const startTime = opportunity.startTime || parsedTime.startTime;
  const endTime = opportunity.endTime || parsedTime.endTime;

  return {
    startDate,
    endDate,
    startTime,
    endTime,
    dateLabel: startDate
      ? [formatIsraeliDate(startDate), endDate && formatIsraeliDate(endDate)]
          .filter(Boolean)
          .join(' – ')
      : '',
    timeLabel: startTime
      ? [startTime, endTime].filter(Boolean).join(' – ')
      : '',
  };
}
