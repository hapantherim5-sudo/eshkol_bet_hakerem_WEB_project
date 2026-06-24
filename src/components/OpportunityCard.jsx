import { STATUS_AR, TYPE_AR } from '../data/fakeData';
import { getOrgName } from '../data/organizations';
import { getCityName } from '../data/opportunitiesSeed';

const CAT_STYLE = {
  sport:     { bar: 'bg-orange-400', shadow: 'hover:shadow-orange-100' },
  art:       { bar: 'bg-violet-500', shadow: 'hover:shadow-violet-100' },
  volunteer: { bar: 'bg-emerald-500',shadow: 'hover:shadow-emerald-100' },
  science:   { bar: 'bg-blue-500',   shadow: 'hover:shadow-blue-100'   },
  community: { bar: 'bg-pink-500',   shadow: 'hover:shadow-pink-100'   },
  workshops: { bar: 'bg-amber-500',  shadow: 'hover:shadow-amber-100'  },
};

function OpportunityCard({ opportunity, lang, onOpenModal }) {
  const o    = opportunity;
  const isAr = lang === 'ar';

  const title       = isAr ? o.titleAr : o.title;
  const description = isAr && o.descriptionAr ? o.descriptionAr : o.description;
  const statusText  = isAr ? (STATUS_AR[o.status] || o.status) : o.status;
  const typeText    = isAr ? (TYPE_AR[o.type]     || o.type)  : o.type;
  const ageLabel    = isAr ? `${o.ageMin}–${o.ageMax} سنة` : `גיל ${o.ageMin}–${o.ageMax}`;

  const cat = CAT_STYLE[o.category] ?? { bar: 'bg-gray-300', shadow: 'hover:shadow-gray-100' };

  const statusClass =
    o.status === 'פתוח'           ? 'bg-green-100 text-green-800'   :
    o.status === 'מקומות אחרונים' ? 'bg-amber-100 text-amber-800'   :
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
      </div>
    </div>
  );
}

export default OpportunityCard;
