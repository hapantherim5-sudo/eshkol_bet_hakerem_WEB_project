import * as users from '../repositories/userRepository.js';
import { verifyToken } from '../services/tokenService.js';
import { AppError } from '../utils/AppError.js';

export async function optionalAuth(req, _res, next) {
  try {
    const header = req.get('authorization');
    if (!header) return next();
    const match = header.match(/^Bearer\s+(.+)$/i);
    if (!match) throw new AppError(401, 'invalid_token');

    const payload = verifyToken(match[1]);
    const user = await users.findSafeById(payload.sub);
    if (!user) throw new AppError(401, 'invalid_token');
    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}

export function requireAuth(req, _res, next) {
  if (!req.user) return next(new AppError(401, 'authentication_required'));
  return next();
}

export function requireRoles(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(new AppError(401, 'authentication_required'));
    if (!roles.includes(req.user.role)) return next(new AppError(403, 'forbidden'));
    return next();
  };
}

export function requireSelfOrRoles(paramName, ...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(new AppError(401, 'authentication_required'));
    if (roles.includes(req.user.role) || Number(req.params[paramName]) === req.user.id) return next();
    return next(new AppError(403, 'forbidden'));
  };
}
