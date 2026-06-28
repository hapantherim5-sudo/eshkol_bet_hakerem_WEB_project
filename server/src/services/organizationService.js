import * as organizations from '../repositories/organizationRepository.js';

export function listOrganizations() {
  return organizations.findAll();
}
