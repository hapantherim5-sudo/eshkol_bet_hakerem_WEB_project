// File: src/components/OpportunityCard.jsx
// Purpose: OpportunityCard component
// Role: React component for OpportunityCard

import { STATUSES, getStatusLabelKey, getTypeLabelKey } from '../../../data/opportunityOptions';
import { getOrgName, getCityName } from '../../../data/organizations';
import { useT } from '../../../i18n/i18n';
import { getOpportunityDisplaySchedule } from '../../../utils/opportunitySchedule';

const CAT_STYLE = {
  sport:     { bar: 'bg-orange-400', shadow: 'hover:shadow-orange-100' },
  art:       { bar: 'bg-violet-500', shadow: 'hover:shadow-violet-100' },
  volunteer: { bar: 'bg-emerald-500',shadow: 'hover:shadow-emerald-100' },
  science:   { bar: 'bg-blue-500',   shadow: 'hover:shadow-blue-100'   },
  community: { bar: 'bg-pink-500',   shadow: 'hover:shadow-pink-100'   },
  workshops: { bar: 'bg-amber-500',  shadow: 'hover:shadow-amber-100'  },
};

// OpportunityCard — renders OpportunityCard
function OpportunityCard({ opportunity, lang, onOpenModal }) {
  const o    = opportunity;
  const isAr = lang === 'ar';
  const t = useT(lang);

  const title       = isAr ? o.titleAr : o.title;
  const description = isAr && o.descriptionAr ? o.descriptionAr : o.description;
  const statusText  = t(getStatusLabelKey(o.status) || o.status);
  const typeText    = t(getTypeLabelKey(o.type) || o.type);
  const ageLabel    = t('card_age_range', { min: o.ageMin, max: o.ageMax });
  const schedule    = getOpportunityDisplaySchedule(o);

  const cat = CAT_STYLE[o.category] ?? { bar: 'bg-gray-300', shadow: 'hover:shadow-gray-100' };

  const statusClass =
    o.status === STATUSES[0].value ? 'bg-green-100 text-green-800'   :
    o.status === STATUSES[1].value ? 'bg-amber-100 text-amber-800'   :
                                    'bg-red-100   text-red-800';

  return (
    <div
      onClick={() => onOpenModal(o)}
      className={`relative bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer
        card-lift shadow-sm hover:shadow-lg ${cat.shadow} transition-shadow duration-200`}>

      {/* Category color bar */}
      <div className={`h-1.5 w-full ${cat.bar}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-4xl leading-none select-none">{o.icon}</span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusClass}`}>
            {statusText}
          </span>
        </div>

        <h3 className="font-bold text-gray-800 text-base mb-1.5 leading-snug">{title}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{description}</p>

        <div className="flex flex-wrap gap-1.5">
          <span className="opportunity-org-badge text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-medium">
            {getOrgName(o.organizationId, isAr)}
          </span>
          <span className="opportunity-city-badge text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg font-medium">
            📍 {getCityName(o.city, isAr)}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">
            {typeText}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">
            🎂 {ageLabel}
          </span>
        </div>

        {schedule.dateLabel && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3
            text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1">
              <span>📅</span>
              <span>{schedule.dateLabel}</span>
            </span>
            {schedule.timeLabel && (
              <span className="flex items-center gap-1">
                <span>🕐</span>
                <span>{schedule.timeLabel}</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OpportunityCard;
