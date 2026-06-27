// File: src/data/organizations.js
// Purpose: organizations script
// Role: static application data definitions

import he from '../i18n/he';
import ar from '../i18n/ar';

const CITY_KEY_BY_VALUE = new Map([
  [he.city_misgav, 'city_misgav'],
  [he.city_karmiel, 'city_karmiel'],
  [he.city_baana, 'city_baana'],
  [he.city_dir_al_asad, 'city_dir_al_asad'],
  [he.city_sakhnin, 'city_sakhnin'],
  [he.city_rama, 'city_rama'],
  [he.city_nahf, 'city_nahf'],
  [he.city_majd_al_krum, 'city_majd_al_krum'],
]);

// getCityName — handles getCityName
export function getCityName(city, isAr) {
  const key = CITY_KEY_BY_VALUE.get(city);
  return key ? (isAr ? ar[key] : he[key]) : city;
}

// ORGANIZATIONS — renders ORGANIZATIONS
export const ORGANIZATIONS = [
  { id: 'youth-misgav', nameKey: 'organization_youth_misgav' },
  { id: 'youth-karmiel', nameKey: 'organization_youth_karmiel' },
  { id: 'community-baana', nameKey: 'organization_community_baana' },
  { id: 'youth-dir-el-asad', nameKey: 'organization_youth_dir_al_asad' },
  { id: 'youth-sakhnin', nameKey: 'organization_youth_sakhnin' },
  { id: 'youth-rama', nameKey: 'organization_youth_rama' },
  { id: 'youth-nahaf', nameKey: 'organization_youth_nahf' },
  { id: 'youth-majd', nameKey: 'organization_youth_majd' },
  { id: 'scouts', nameKey: 'organization_scouts' },
  { id: 'mda', nameKey: 'organization_mda' },
];

// getOrgName — handles getOrgName
export function getOrgName(orgId, isAr) {
  const org = ORGANIZATIONS.find(item => item.id === orgId);
  if (!org) return '';
  return (isAr ? ar : he)[org.nameKey];
}
