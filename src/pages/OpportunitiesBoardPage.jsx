import { useEffect, useRef, useState } from 'react';
import OpportunityCard from '../components/OpportunityCard';
import { CATEGORIES, TYPE_AR } from '../data/fakeData';
import { ORGANIZATIONS, getOrgName, getCityName } from '../data/organizations';
import { useT } from '../i18n/i18n';

const CAT_ACTIVE = {
  sport:     'bg-orange-500 text-white border-orange-500 shadow-orange-100',
  art:       'bg-violet-500 text-white border-violet-500 shadow-violet-100',
  volunteer: 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-100',
  science:   'bg-blue-500   text-white border-blue-500   shadow-blue-100',
  community: 'bg-pink-500   text-white border-pink-500   shadow-pink-100',
  workshops: 'bg-amber-500  text-white border-amber-500  shadow-amber-100',
};

function FilterDropdown({ id, label, value, options, open, onToggle, onChange }) {
  const selectedLabel = options.find(option => option.value === value)?.label ?? options[0]?.label;

  return (
    <div className="relative">
      {label && <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-options`}
        onClick={onToggle}
        className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-xl text-sm cursor-pointer
          flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500
          text-gray-800 transition">
        <span className="truncate">{selectedLabel}</span>
        <span className={`text-xs text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {open && (
        <div id={`${id}-options`} role="listbox"
          className="filter-dropdown-options absolute z-20 mt-1 w-full max-h-56 overflow-y-auto rounded-xl border border-gray-200
            bg-white shadow-lg py-1">
          {options.map(option => (
            <button key={option.value || 'all'} type="button" role="option"
              aria-selected={value === option.value}
              onClick={() => onChange(option.value)}
              className={`filter-dropdown-option w-full px-3 py-2 text-right text-sm cursor-pointer transition
                ${value === option.value
                  ? 'bg-emerald-100 text-emerald-800 font-bold'
                  : 'text-gray-700 hover:bg-emerald-50'}`}>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function OpportunitiesBoardPage({ opportunities, lang, onOpenModal }) {
  const t = useT(lang);
  const isAr = lang === 'ar';

  const [searchText,  setSearchText]  = useState('');
  const [filterCity,  setFilterCity]  = useState('');
  const [filterOrg,   setFilterOrg]   = useState('');
  const [filterCat,   setFilterCat]   = useState('');
  const [filterType,  setFilterType]  = useState('');
  const [filterScope, setFilterScope] = useState('');
  const [filterAge,   setFilterAge]   = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(null);
  const filtersRef = useRef(null);

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
        !o.description.toLowerCase().includes(q) && !o.city.includes(q) &&
        !getCityName(o.city, true).includes(q) &&
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

  useEffect(() => {
    if (!openFilter) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!filtersRef.current?.contains(event.target)) setOpenFilter(null);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpenFilter(null);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [openFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 animate-fade-in">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800">{t('board_title')}</h1>
          <p className="text-sm text-gray-500 mt-0.5 font-medium">
            {filtered.length} {t('board_count')}
            {hasActiveFilters && (
              <button onClick={clearFilters}
                className="mr-2 text-xs text-red-500 hover:text-red-600 underline transition">
                ({t('board_clear_filters')})
              </button>
            )}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <span className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 text-sm pointer-events-none">🔍</span>
          <input
            type="text"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder={t('search_placeholder')}
            className="w-full pr-9 pl-4 py-2.5 border border-gray-200 bg-white rounded-xl
              focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 text-sm
              shadow-sm transition" />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
        <button
          onClick={() => setFilterCat('')}
          className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold
            border transition-all duration-150 shadow-sm
            ${!filterCat
              ? 'bg-gray-800 text-white border-gray-800 shadow-gray-200'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-800'}`}>
          ⭐ {t('all')}
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

      <div ref={filtersRef} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <button
          type="button"
          onClick={() => setFiltersOpen(o => !o)}
          className="w-full flex items-center justify-between py-1 text-sm font-semibold text-gray-600
            hover:text-emerald-700 transition md:hidden">
          <span>{t('board_filters_toggle')}</span>
          <span className="text-gray-400 text-xs">{filtersOpen ? '▲' : '▼'}</span>
        </button>

        <div className={`${filtersOpen ? 'block' : 'hidden'} md:block mt-2 md:mt-0`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                🏢 {t('board_filter_org')}
              </label>
              <FilterDropdown
                id="filter-org"
                label={null}
                value={filterOrg}
                open={openFilter === 'org'}
                onToggle={() => setOpenFilter(openFilter === 'org' ? null : 'org')}
                onChange={(value) => { setFilterOrg(value); setOpenFilter(null); }}
                options={[{ value: '', label: t('all') }, ...ORGANIZATIONS.map(o => ({
                  value: o.id, label: isAr ? o.nameAr : o.nameHe,
                }))]}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                📍 {t('board_filter_city')}
              </label>
              <FilterDropdown
                id="filter-city"
                label={null}
                value={filterCity}
                open={openFilter === 'city'}
                onToggle={() => setOpenFilter(openFilter === 'city' ? null : 'city')}
                onChange={(value) => { setFilterCity(value); setOpenFilter(null); }}
                options={[{ value: '', label: t('all') }, ...cities.map(c => ({ value: c, label: getCityName(c, isAr) }))]}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                🔖 {t('board_filter_type')}
              </label>
              <FilterDropdown
                id="filter-type"
                label={null}
                value={filterType}
                open={openFilter === 'type'}
                onToggle={() => setOpenFilter(openFilter === 'type' ? null : 'type')}
                onChange={(value) => { setFilterType(value); setOpenFilter(null); }}
                options={[{ value: '', label: t('all') }, ...types.map(tp => ({
                  value: tp, label: isAr ? (TYPE_AR[tp] || tp) : tp,
                }))]}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                🗺️ {t('board_filter_scope')}
              </label>
              <FilterDropdown
                id="filter-scope"
                label={null}
                value={filterScope}
                open={openFilter === 'scope'}
                onToggle={() => setOpenFilter(openFilter === 'scope' ? null : 'scope')}
                onChange={(value) => { setFilterScope(value); setOpenFilter(null); }}
                options={[
                  { value: '', label: t('all') },
                  { value: 'יישובי', label: t('board_scope_local') },
                  { value: 'אזורי', label: t('board_scope_regional') },
                ]}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                🎂 {t('board_filter_age')}
              </label>
              <input
                type="number"
                value={filterAge}
                onChange={e => setFilterAge(e.target.value)}
                placeholder={t('board_age_placeholder')}
                className={selectClass} />
            </div>
          </div>
        </div>
      </div>

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
          <p className="text-xl font-bold text-gray-500 mb-2">{t('board_empty_title')}</p>
          <p className="text-sm text-gray-400 mb-5">{t('board_empty_subtitle')}</p>
          {hasActiveFilters && (
            <button onClick={clearFilters}
              className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700
                transition shadow-md text-sm">
              {t('board_clear_all')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default OpportunitiesBoardPage;
