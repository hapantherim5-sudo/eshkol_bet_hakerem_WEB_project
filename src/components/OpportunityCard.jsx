import { STATUS_AR, TYPE_AR, SCOPE_AR } from '../data/fakeData';

function OpportunityCard({ opportunity, lang, onOpenModal }) {
  const o    = opportunity;
  const isAr = lang === 'ar';

  const title       = isAr ? o.titleAr : o.title;
  const description = isAr && o.descriptionAr ? o.descriptionAr : o.description;
  const statusText  = isAr ? (STATUS_AR[o.status] || o.status) : o.status;
  const typeText    = isAr ? (TYPE_AR[o.type]      || o.type)  : o.type;
  const scopeText   = isAr ? (SCOPE_AR[o.scope]    || o.scope) : o.scope;
  const ageLabel    = isAr ? `عمر ${o.ageMin}-${o.ageMax}` : `גיל ${o.ageMin}-${o.ageMax}`;

  const statusClass =
    o.status === 'פתוח'           ? 'bg-green-100 text-green-800'   :
    o.status === 'מקומות אחרונים' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800';

  return (
    <div onClick={() => onOpenModal(o)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5
        cursor-pointer transition hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-100">

      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-3xl">{o.icon}</span>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusClass}`}>
          {statusText}
        </span>
      </div>

      <h3 className="font-bold text-gray-800 text-base mb-1">{title}</h3>
      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{description}</p>

      <div className="flex flex-wrap gap-1.5">
        <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">{o.city}</span>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">{typeText}</span>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">{ageLabel}</span>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">{scopeText}</span>
      </div>
    </div>
  );
}

export default OpportunityCard;