import { CITY_ORG, OPPORTUNITIES_BY_CITY, buildInitialOpportunities } from './opportunitiesSeed.js';

const STAFF_CITIES = Object.keys(OPPORTUNITIES_BY_CITY);

const STAFF_USERS = STAFF_CITIES.map((city, i) => ({
  id: i + 3,
  username: city,
  password: '1234',
  name: city,
  role: 'Staff',
  organizationId: CITY_ORG[city],
}));

export const FAKE_USERS = [
  { id: 1, username: 'admin', password: '1234', name: 'ירה עבאס דאהר', role: 'Admin' },
  { id: 2, username: 'youth', password: '1234', name: 'אחמד נמר',       role: 'User' },
  ...STAFF_USERS,
];

export const CATEGORIES = [
  { id: 'sport',     label: 'ספורט',         labelAr: 'رياضة',           icon: '⚽' },
  { id: 'art',       label: 'אמנות ויצירה',   labelAr: 'فنون وإبداع',     icon: '🎨' },
  { id: 'volunteer', label: 'התנדבות',        labelAr: 'تطوع',            icon: '🤝' },
  { id: 'science',   label: 'מדע וטכנולוגיה', labelAr: 'علوم وتكنولوجيا', icon: '🔬' },
  { id: 'community', label: 'קהילה וחברה',    labelAr: 'مجتمع',           icon: '🏘️' },
  { id: 'workshops', label: 'סדנאות והכשרות', labelAr: 'ورش عمل وتدريب',  icon: '📚' },
];

export const STATUS_AR = {
  'פתוח': 'مفتوح', 'מקומות אחרונים': 'أماكن محدودة',
  'נסגר בקרוב': 'يغلق قريباً', 'סגור להרשמה': 'مغلق للتسجيل',
};
export const TYPE_AR = {
  'חוג': 'دوري', 'סדנה': 'ورشة', 'תנועת נוער': 'حركة شباب',
  'התנדבות': 'تطوع', 'מיזם': 'مبادرة', 'הכשרה': 'تدريب', 'תוכנית': 'برنامج',
};
export const SCOPE_AR = { 'יישובי': 'بلدي', 'אזורי': 'إقليمي' };

export const OPPORTUNITY_TYPES = ['חוג', 'סדנה', 'תנועת נוער', 'התנדבות', 'מיזם', 'הכשרה', 'תוכנית'];
export const STATUSES = ['פתוח', 'מקומות אחרונים', 'נסגר בקרוב', 'סגור להרשמה'];

export const INITIAL_OPPORTUNITIES = buildInitialOpportunities();

// Seed events — sample from first opportunity per city
const y = new Date().getFullYear();
const m = String(new Date().getMonth() + 1).padStart(2, '0');
const sampleByCity = {};
for (const opp of INITIAL_OPPORTUNITIES) {
  if (!sampleByCity[opp.city]) sampleByCity[opp.city] = opp;
}
export const INITIAL_EVENTS = Object.values(sampleByCity).map((opp, i) => ({
  id: i + 1,
  title: opp.title,
  titleAr: opp.titleAr,
  organizationId: opp.organizationId,
  city: opp.city,
  startsAt: `${y}-${m}-${String(10 + i).padStart(2, '0')}T17:00:00`,
  opportunityId: opp.id,
}));
