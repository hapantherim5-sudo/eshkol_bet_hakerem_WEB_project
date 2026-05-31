// Staff may only manage opportunities for their organization
export function canManageOpportunity(user, opp) {
  if (!user) return false;
  if (user.role === 'Admin') return true;
  if (user.role === 'Staff') return opp.organizationId === user.organizationId;
  return false;
}

export function isStaffRole(user) {
  return user?.role === 'Admin' || user?.role === 'Staff';
}

export function filterManageable(user, opportunities) {
  if (!user) return [];
  if (user.role === 'Admin') return opportunities;
  if (user.role === 'Staff') {
    return opportunities.filter(o => o.organizationId === user.organizationId);
  }
  return [];
}
