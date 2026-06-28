import { useMemo, useState } from 'react';
import { getCityName, getOrgName } from '../../../data/organizations';

export function useOpportunityFilters(opportunities, isArabic) {
  const [searchText, setSearchText] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterOrg, setFilterOrg] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterScope, setFilterScope] = useState('');
  const [filterAge, setFilterAge] = useState('');

  const cities = useMemo(() => [...new Set(opportunities.map(item => item.city))].sort(), [opportunities]);
  const types = useMemo(() => [...new Set(opportunities.map(item => item.type))].sort(), [opportunities]);
  const filtered = useMemo(() => opportunities.filter(opportunity => {
    const query = searchText.toLowerCase();
    if (filterCity && opportunity.city !== filterCity) return false;
    if (filterOrg && opportunity.organizationId !== filterOrg) return false;
    if (filterCat && opportunity.category !== filterCat) return false;
    if (filterType && opportunity.type !== filterType) return false;
    if (filterScope && opportunity.scope !== filterScope) return false;
    if (filterAge && (Number(filterAge) < opportunity.ageMin || Number(filterAge) > opportunity.ageMax)) return false;
    if (!query) return true;
    return [
      opportunity.title,
      opportunity.titleAr,
      opportunity.description,
      opportunity.city,
      getCityName(opportunity.city, true),
      getOrgName(opportunity.organizationId, isArabic),
    ].some(value => String(value || '').toLowerCase().includes(query));
  }), [opportunities, searchText, filterCity, filterOrg, filterCat, filterType, filterScope, filterAge, isArabic]);

  const clearFilters = () => {
    setSearchText('');
    setFilterCity('');
    setFilterOrg('');
    setFilterCat('');
    setFilterType('');
    setFilterScope('');
    setFilterAge('');
  };

  return {
    searchText, setSearchText,
    filterCity, setFilterCity,
    filterOrg, setFilterOrg,
    filterCat, setFilterCat,
    filterType, setFilterType,
    filterScope, setFilterScope,
    filterAge, setFilterAge,
    cities, types, filtered, clearFilters,
    hasActiveFilters: Boolean(searchText || filterCity || filterOrg || filterCat || filterType || filterScope || filterAge),
  };
}
