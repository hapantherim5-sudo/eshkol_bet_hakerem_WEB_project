import { useState } from 'react';
import OpportunityCard from '../components/OpportunityCard';
import { CATEGORIES, TYPE_AR } from '../data/fakeData';
import { ORGANIZATIONS, getOrgName } from '../data/organizations';

const CAT_ACTIVE = {
  sport:     'bg-orange-500 text-white border-orange-500 shadow-orange-100',
  art:       'bg-violet-500 text-white border-violet-500 shadow-violet-100',
  volunteer: 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-100',
  science:   'bg-blue-500   text-white border-blue-500   shadow-blue-100',
  community: 'bg-pink-500   text-white border-pink-500   shadow-pink-100',
  workshops: 'bg-amber-500  text-white border-amber-500  shadow-amber-100',
};

function OpportunitiesBoardPage({ opportunities, lang, onOpenModal }) {
  const isAr = lang === 'ar';
  const ALL  = isAr ? 'الكل' : 'הכל';

  const [searchText,  setSearchText]  = useState('');
  const [filterCity,  setFilterCity]  = useState('');
  const [filterOrg,   setFilterOrg]   = useState('');
  const [filterCat,   setFilterCat]   = useState('');
  const [filterType,  setFilterType]  = useState('');
  const [filterScope, setFilterScope] = useState('');
  const [filterAge,   setFilterAge]   = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

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

  const clearFilters = () => {
    setSearchText(''); setFilterCity(''); setFilterOrg('');
    setFilterCat(''); setFilterType(''); setFilterScope(''); setFilterAge('');
  };

  const hasActiveFilters = searchText || filterCity || filterOrg || filterCat || filterType || filterScope || filterAge;

  const selectClass = `w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-xl text-sm
    focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 transition`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 animate-fade-in">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800">
            {isAr ? 'لوح الفرص' : 'לוח ההזדמנויות'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5 font-medium">
            {isAr
              ? `${filtered.length} فرصة متاحة`
              : `${filtered.length} הזדמנויות זמינות`}
            {hasActiveFilters && (
              <button onClick={clearFilters}
                className="mr-2 text-xs text-red-500 hover:text-red-600 underline transition">
                ({isAr ? 'مسح الفلاتر' : 'נקה פילטרים'})
              </button>
            )}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <span className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 text-sm pointer-events-none">🔍</span>
          <input
            type="text"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder={isAr ? 'بحث...' : 'חיפוש...'}
            className="w-full pr-9 pl-4 py-2.5 border border-gray-200 bg-white rounded-xl
              focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 text-sm
              shadow-sm transition" />
        </div>
      </div>

      {/* ── Category chips ── */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
        <button
          onClick={() => setFilterCat('')}
          className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold
            border transition-all duration-150 shadow-sm
            ${!filterCat
              ? 'bg-gray-800 text-white border-gray-800 shadow-gray-200'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-800'}`}>
          ⭐ {isAr ? 'الكل' : 'הכל'}
        </button>
        {CATEGORIES.map(cat => {
          const active = filterCat === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilterCat(active ? '' : cat.id)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold
                border transition-all duration-150 shadow-sm
                ${active
                  ? (CAT_ACTIVE[cat.id] ?? 'bg-emerald-600 text-white border-emerald-600') + ' shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-800'}`}>
              {cat.icon} {isAr ? cat.labelAr : cat.label}
            </button>
          );
        })}
      </div>

      {/* ── Additional filters ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <button
          type="button"
          onClick={() => setFiltersOpen(o => !o)}
          className="w-full flex items-center justify-between py-1 text-sm font-semibold text-gray-600
            hover:text-emerald-700 transition md:hidden">
          <span>{isAr ? '🔽 فلاتر إضافية' : '🔽 פילטרים נוספים'}</span>
          <span className="text-gray-400 text-xs">{filtersOpen ? '▲' : '▼'}</span>
        </button>

        <div className={`${filtersOpen ? 'block' : 'hidden'} md:block mt-2 md:mt-0`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                🏢 {isAr ? 'الجهة' : 'ארגון'}
              </label>
              <select value={filterOrg} onChange={e => setFilterOrg(e.target.value)} className={selectClass}>
                <option value="">{ALL}</option>
                {ORGANIZATIONS.map(o => (
                  <option key={o.id} value={o.id}>{isAr ? o.nameAr : o.nameHe}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                📍 {isAr ? 'البلدة' : 'יישוב'}
              </label>
              <select value={filterCity} onChange={e => setFilterCity(e.target.value)} className={selectClass}>
                <option value="">{ALL}</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                🔖 {isAr ? 'النوع' : 'סוג'}
              </label>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} className={selectClass}>
                <option value="">{ALL}</option>
                {types.map(t => <option key={t} value={t}>{isAr ? (TYPE_AR[t] || t) : t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                🗺️ {isAr ? 'النطاق' : 'היקף'}
              </label>
              <select value={filterScope} onChange={e => setFilterScope(e.target.value)} className={selectClass}>
                <option value="">{ALL}</option>
                <option value="יישובי">{isAr ? 'بلدي'   : 'יישובי'}</option>
                <option value="אזורי"> {isAr ? 'إقليمي' : 'אזורי'} </option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                🎂 {isAr ? 'العمر' : 'גיל'}
              </label>
              <input
                type="number"
                value={filterAge}
                onChange={e => setFilterAge(e.target.value)}
                placeholder={isAr ? 'כל الأعمار' : 'כל גיל'}
                className={selectClass} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Results grid ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((o, i) => (
            <div key={o.id} className="animate-card-in" style={{ animationDelay: `${Math.min(i, 8) * 0.04}s` }}>
              <OpportunityCard opportunity={o} lang={lang} onOpenModal={onOpenModal} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-gray-400">
          <p className="text-6xl mb-4 animate-float inline-block">🔍</p>
          <p className="text-xl font-bold text-gray-500 mb-2">
            {isAr ? 'لم يتم العثور على فرص' : 'לא נמצאו הזדמנויות'}
          </p>
          <p className="text-sm text-gray-400 mb-5">
            {isAr ? 'جرّب تعديل الفلاتر أو البحث' : 'נסה לשנות את הפילטרים או החיפוש'}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters}
              className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700
                transition shadow-md text-sm">
              {isAr ? 'مسح جميع الفلاتر' : 'נקה את כל הפילטרים'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default OpportunitiesBoardPage;
