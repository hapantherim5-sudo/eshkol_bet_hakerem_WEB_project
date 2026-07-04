import { createHmac, timingSafeEqual } from 'node:crypto';
import { AppError } from '../utils/AppError.js';

const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;

function secret() {
  return process.env.AUTH_SECRET
    || process.env.MONGODB_URI
    || 'eshkol-local-development-secret';
}

function signature(payload) {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

export function issueToken(user) {
  const payload = Buffer.from(JSON.stringify({
    sub: user.id,
    exp: Date.now() + TOKEN_TTL_MS,
  })).toString('base64url');
  return `${payload}.${signature(payload)}`;
}

export function verifyToken(token) {
  const [payload, suppliedSignature, extra] = String(token || '').split('.');
  if (!payload || !suppliedSignature || extra) throw new AppError(401, 'invalid_token');

  const expected = Buffer.from(signature(payload));
  const supplied = Buffer.from(suppliedSignature);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) {
    throw new AppError(401, 'invalid_token');
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!Number.isFinite(decoded.sub) || !Number.isFinite(decoded.exp) || decoded.exp <= Date.now()) {
      throw new Error('expired');
    }
    return decoded;
  } catch {
    throw new AppError(401, 'invalid_token');
  }
}
