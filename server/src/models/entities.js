export function toSafeUser(user) {
  if (!user) return null;
  const safeUser = { ...user };
  delete safeUser.password;
  delete safeUser._id;
  return safeUser;
}

export function createUser({ id, name, username, password, role = 'User', organizationId }) {
  return {
    id,
    name: name.trim(),
    username: username.trim(),
    password: password.trim(),
    role,
    ...(organizationId ? { organizationId } : {}),
  };
}

export function createUserPatch({ name, username, password, role, organizationId }) {
  const patch = {};
  if (name?.trim()) patch.name = name.trim();
  if (username?.trim()) patch.username = username.trim();
  if (password?.trim()) patch.password = password.trim();
  if (role) patch.role = role;
  if (organizationId !== undefined) patch.organizationId = organizationId || null;
  return patch;
}

export function createOpportunity(body, id) {
  return { ...withoutMongoMetadata(body), id };
}

export function createEvent(body, id, opportunityId = body?.opportunityId) {
  return { ...withoutMongoMetadata(body), id, ...(opportunityId !== undefined ? { opportunityId } : {}) };
}

export function createRegistration(id, userId, opportunityId) {
  return { id, userId, opportunityId, createdAt: new Date().toISOString() };
}

export function createCancellation(id, userId, opportunityId) {
  return { id, userId, opportunityId, cancelledAt: new Date().toISOString() };
}

export function createView(opportunityId, userId = null) {
  return { opportunityId, userId, viewedAt: new Date().toISOString() };
}

function withoutMongoMetadata(value) {
  const document = { ...(value || {}) };
  delete document._id;
  return document;
}
