import * as profiles from '../repositories/profileRepository.js';

export async function getProfile(userId) {
  const profile = await profiles.findByUserId(userId);
  return profile?.data || null;
}
