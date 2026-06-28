import { useEffect, useRef, useState } from 'react';
import { CATEGORIES, OPPORTUNITY_SCOPES, getTypeLabelKey } from '../../../data/opportunityOptions';
import { ORGANIZATIONS, getCityName, getOrgName } from '../../../data/organizations';
import { useT } from '../../../i18n/i18n';
import FilterDropdown from '../components/FilterDropdown';
import OpportunityCard from '../components/OpportunityCard';
import { useOpportunityFilters } from '../hooks/useOpportunityFilters';

const CATEGORY_TONES = {
  sport: 'bg-orange-500 border-orange-500', art: 'bg-violet-500 border-violet-500',
  volunteer: 'bg-emerald-600 border-emerald-600', science: 'bg-blue-500 border-blue-500',
  community: 'bg-pink-500 border-pink-500', workshops: 'bg-amber-500 border-amber-500',
};

export default function OpportunitiesBoardPage({ opportunities, lang, onOpenModal }) {
  const t = useT(lang);
  const isArabic = lang === 'ar';
  const filters = useOpportunityFilters(opportunities, isArabic);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(null);
  const filtersRef = useRef(null);

  useEffect(() => {
    if (!openFilter) return undefined;
    const close = event => {
      if (event.type === 'keydown' && event.key !== 'Escape') return;
      if (event.type === 'mousedown' && filtersRef.current?.contains(event.target)) return;
      setOpenFilter(null);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [openFilter]);

  const dropdown = (id, value, setValue, options) => (
    <FilterDropdown
      id={`filter-${id}`}
      value={value}
      options={options}
      open={openFilter === id}
      onToggle={() => setOpenFilter(openFilter === id ? null : id)}
      onChange={nextValue => { setValue(nextValue); setOpenFilter(null); }}
    />
  );

  return (
    <div className="mx-auto max-w-7xl animate-fade-in px-4 py-6 sm:py-8">
      <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><h1 className="text-2xl font-black text-gray-800 sm:text-3xl">{t('board_title')}</h1><p className="mt-0.5 text-sm font-medium text-gray-500">{filters.filtered.length} {t('board_count')}{filters.hasActiveFilters && <button onClick={filters.clearFilters} className="mr-2 text-xs text-red-500 underline">({t('board_clear_filters')})</button>}</p></div>
        <div className="relative w-full sm:w-72"><span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span><input value={filters.searchText} onChange={event => filters.setSearchText(event.target.value)} placeholder={t('search_placeholder')} className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-9 pl-4 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
      </header>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <CategoryButton active={!filters.filterCat} onClick={() => filters.setFilterCat('')}>⭐ {t('all')}</CategoryButton>
        {CATEGORIES.map(category => <CategoryButton key={category.id} active={filters.filterCat === category.id} tone={CATEGORY_TONES[category.id]} onClick={() => filters.setFilterCat(filters.filterCat === category.id ? '' : category.id)}>{category.icon} {t(category.labelKey)}</CategoryButton>)}
      </div>

      <div ref={filtersRef} className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <button onClick={() => setFiltersOpen(open => !open)} className="flex w-full items-center justify-between py-1 text-sm font-semibold text-gray-600 md:hidden"><span>{t('board_filters_toggle')}</span><span>{filtersOpen ? '▲' : '▼'}</span></button>
        <div className={`${filtersOpen ? 'block' : 'hidden'} mt-2 md:mt-0 md:block`}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-5">
            <FilterField label={`🏢 ${t('board_filter_org')}`}>{dropdown('org', filters.filterOrg, filters.setFilterOrg, [{ value: '', label: t('all') }, ...ORGANIZATIONS.map(item => ({ value: item.id, label: getOrgName(item.id, isArabic) }))])}</FilterField>
            <FilterField label={`📍 ${t('board_filter_city')}`}>{dropdown('city', filters.filterCity, filters.setFilterCity, [{ value: '', label: t('all') }, ...filters.cities.map(city => ({ value: city, label: getCityName(city, isArabic) }))])}</FilterField>
            <FilterField label={`🔖 ${t('board_filter_type')}`}>{dropdown('type', filters.filterType, filters.setFilterType, [{ value: '', label: t('all') }, ...filters.types.map(type => ({ value: type, label: t(getTypeLabelKey(type) || type) }))])}</FilterField>
            <FilterField label={`🗺️ ${t('board_filter_scope')}`}>{dropdown('scope', filters.filterScope, filters.setFilterScope, [{ value: '', label: t('all') }, ...OPPORTUNITY_SCOPES.map(scope => ({ value: scope.value, label: t(scope.labelKey) }))])}</FilterField>
            <FilterField label={`🎂 ${t('board_filter_age')}`}><input type="number" min="6" max="99" value={filters.filterAge} onChange={event => filters.setFilterAge(event.target.value)} placeholder={t('board_age_placeholder')} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></FilterField>
          </div>
        </div>
      </div>

      {filters.filtered.length ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{filters.filtered.map(opportunity => <OpportunityCard key={opportunity.id} opportunity={opportunity} lang={lang} onOpenModal={onOpenModal} />)}</div> : <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center"><p className="mb-3 text-4xl">🔍</p><p className="mb-5 text-sm text-gray-400">{t('board_empty_subtitle')}</p><button onClick={filters.clearFilters} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white">{t('board_clear_filters')}</button></div>}
    </div>
  );
}

function FilterField({ label, children }) {
  return <div><label className="mb-1 block text-xs font-semibold text-gray-500">{label}</label>{children}</div>;
}

function CategoryButton({ active, tone = 'bg-gray-800 border-gray-800', onClick, children }) {
  return <button onClick={onClick} className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition ${active ? `${tone} text-white` : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'}`}>{children}</button>;
}
