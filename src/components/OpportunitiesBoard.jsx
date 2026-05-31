import { useState } from 'react';
import OpportunityCard from './OpportunityCard';
import { CATEGORIES, TYPE_AR, SCOPE_AR } from '../data/fakeData';
import { ORGANIZATIONS, getOrgName } from '../data/organizations';

function OpportunitiesBoard({ opportunities, lang, onOpenModal }) {
  const isAr = lang === 'ar';
  const ALL  = isAr ? 'الكل' : 'הכל';

  const [searchText,  setSearchText]  = useState('');
  const [filterCity,  setFilterCity]  = useState('');
  const [filterOrg,   setFilterOrg]   = useState('');
  const [filterCat,   setFilterCat]   = useState('');
  const [filterType,  setFilterType]  = useState('');
  const [filterScope, setFilterScope] = useState('');
  const [filterAge,   setFilterAge]   = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false); // Mobile: collapsed by default

  const cities = [...new Set(opportunities.map(o => o.city))].sort();
  const types  = [...new Set(opportunities.map(o => o.type))].sort();

  const filtered = opportunities.filter(o => {
    const q = searchText.toLowerCase();
    if (filterCity  && o.city !== filterCity) return false;
    if (filterOrg   && o.organizationId !== filterOrg) return false;
    if (filterCat   && o.category !== filterCat) return false;
    if (filterType  && o.type !== filterType) return false;
    if (filterScope && o.scope !== filterScope) return false;
    if (filterAge && (parseInt(filterAge) < o.ageMin || parseInt(filterAge) > o.ageMax)) return false;
    const orgName = getOrgName(o.organizationId, isAr);
    if (q && !o.title.toLowerCase().includes(q) && !o.titleAr.includes(q) &&
        !o.description.includes(q) && !o.city.includes(q) &&
        !orgName.toLowerCase().includes(q)) return false;
    return true;
  });

  const selectClass = `w-full px-3 py-2 border border-gray-200 bg-gray-50
    rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800`;

  const clearFilters = () => {
    setSearchText(''); setFilterCity(''); setFilterOrg('');
    setFilterCat(''); setFilterType(''); setFilterScope(''); setFilterAge('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-800">
            {isAr ? 'لوح الفرص' : 'לוח ההזדמנויות'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isAr ? `تم العثور على ${filtered.length} فرصة` : `${filtered.length} הזדמנויות נמצאו`}
          </p>
        </div>
        <input type="text" value={searchText}
          onChange={e => setSearchText(e.target.value)}
          placeholder={isAr ? 'بحث حر...' : 'חיפוש חופשי...'}
          className="w-full md:w-72 px-4 py-2.5 border border-gray-200 bg-white
            rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 text-sm" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        {/* Mobile: toggle filters panel */}
        <button
          type="button"
          onClick={() => setFiltersOpen(o => !o)}
          className="md:hidden w-full flex items-center justify-between py-2 mb-2 text-sm font-medium text-emerald-700">
          <span>{isAr ? '🔽 تصفية' : '🔽 סינון'}</span>
          <span className="text-gray-400">{filtersOpen ? '▲' : '▼'}</span>
        </button>

        <div className={`${filtersOpen ? 'block' : 'hidden'} md:block`}>
          {/* Mobile: one column; desktop: up to six */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {isAr ? '🏢 الجهة' : '🏢 ארגון מפעיל'}
              </label>
              <select value={filterOrg} onChange={e => setFilterOrg(e.target.value)} className={selectClass}>
                <option value="">{ALL}</option>
                {ORGANIZATIONS.map(o => (
                  <option key={o.id} value={o.id}>{isAr ? o.nameAr : o.nameHe}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {isAr ? '🏘️ البلدة' : '🏘️ יישוב'}
              </label>
              <select value={filterCity} onChange={e => setFilterCity(e.target.value)} className={selectClass}>
                <option value="">{ALL}</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {isAr ? '📂 الفئة' : '📂 קטגוריה'}
              </label>
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className={selectClass}>
                <option value="">{ALL}</option>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {isAr ? c.labelAr : c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {isAr ? '🔖 النوع' : '🔖 סוג'}
              </label>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} className={selectClass}>
                <option value="">{ALL}</option>
                {types.map(t => <option key={t} value={t}>{isAr ? (TYPE_AR[t] || t) : t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {isAr ? '🗺️ النطاق' : '🗺️ היקף'}
              </label>
              <select value={filterScope} onChange={e => setFilterScope(e.target.value)} className={selectClass}>
                <option value="">{ALL}</option>
                <option value="יישובי">{isAr ? 'بلدي'   : 'יישובי'}</option>
                <option value="אזורי"> {isAr ? 'إقليمي' : 'אזורי'} </option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {isAr ? '🎂 العمر' : '🎂 גיל'}
              </label>
              <input type="number" value={filterAge}
                onChange={e => setFilterAge(e.target.value)}
                placeholder={isAr ? 'كل الأعمار' : 'כל גיל'}
                className={selectClass} />
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <button onClick={clearFilters}
              className="text-xs text-gray-400 hover:text-red-500 transition underline min-h-[44px] flex items-center">
              {isAr ? 'مسح الفلاتر' : 'נקה פילטרים'}
            </button>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(o => (
            <OpportunityCard key={o.id} opportunity={o} lang={lang} onOpenModal={onOpenModal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg font-medium">
            {isAr ? 'لم يتم العثور على فرص' : 'לא נמצאו הזדמנויות'}
          </p>
        </div>
      )}
    </div>
  );
}

export default OpportunitiesBoard;
