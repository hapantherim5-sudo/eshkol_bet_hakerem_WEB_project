import he from '../i18n/he';
import ar from '../i18n/ar';

export const CATEGORIES = [
  { id: 'sport',     labelKey: 'category_sport', icon: '⚽' },
  { id: 'art',       labelKey: 'category_art', icon: '🎨' },
  { id: 'volunteer', labelKey: 'category_volunteer', icon: '🤝' },
  { id: 'science',   labelKey: 'category_science', icon: '🔬' },
  { id: 'community', labelKey: 'category_community', icon: '🏘️' },
  { id: 'workshops', labelKey: 'category_workshops', icon: '📚' },
];

export const STATUSES = [
  { value: he.status_open, labelKey: 'status_open' },
  { value: he.status_last_places, labelKey: 'status_last_places' },
  { value: he.status_closing_soon, labelKey: 'status_closing_soon' },
  { value: he.status_closed, labelKey: 'status_closed' },
];

export const OPPORTUNITY_TYPES = [
  { value: he.opportunity_type_class, labelKey: 'opportunity_type_class' },
  { value: he.opportunity_type_workshop, labelKey: 'opportunity_type_workshop' },
  { value: he.opportunity_type_youth_movement, labelKey: 'opportunity_type_youth_movement' },
  { value: he.opportunity_type_volunteering, labelKey: 'opportunity_type_volunteering' },
  { value: he.opportunity_type_initiative, labelKey: 'opportunity_type_initiative' },
  { value: he.opportunity_type_training, labelKey: 'opportunity_type_training' },
  { value: he.opportunity_type_program, labelKey: 'opportunity_type_program' },
];

export const OPPORTUNITY_SCOPES = [
  { value: he.board_scope_local, labelKey: 'board_scope_local' },
  { value: he.board_scope_regional, labelKey: 'board_scope_regional' },
];

export const DEFAULT_REGISTRATION = {
  he: he.registration_phone,
  ar: ar.registration_phone,
};

export const getStatusLabelKey = value =>
  STATUSES.find(status => status.value === value)?.labelKey;

export const getTypeLabelKey = value =>
  OPPORTUNITY_TYPES.find(type => type.value === value)?.labelKey;
