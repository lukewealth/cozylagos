import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'cozy-lagos-secret-key-2024-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'cozy-lagos-encryption-key-32bytes!';

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPasswordHash(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':');
  const derivedHash = scryptSync(password, salt, 64).toString('hex');
  const buf1 = Buffer.from(hash, 'hex');
  const buf2 = Buffer.from(derivedHash, 'hex');
  if (buf1.length !== buf2.length) return false;
  return timingSafeEqual(buf1, buf2);
}

export function signJWT(payload: Record<string, any>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = new Date();
  const match = JWT_EXPIRES_IN.match(/^(\d+)([dhms])$/);
  if (match) {
    const val = parseInt(match[1]);
    const unit = match[2];
    switch (unit) {
      case 'd': exp.setDate(exp.getDate() + val); break;
      case 'h': exp.setHours(exp.getHours() + val); break;
      case 'm': exp.setMinutes(exp.getMinutes() + val); break;
      case 's': exp.setSeconds(exp.getSeconds() + val); break;
    }
  } else {
    exp.setDate(exp.getDate() + 7);
  }
  const body = Buffer.from(JSON.stringify({ ...payload, exp: exp.getTime(), iat: Date.now() })).toString('base64url');
  const signature = createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyJWT(token: string): { valid: boolean; payload?: any } {
  try {
    const [header, body, signature] = token.split('.');
    if (!header || !body || !signature) return { valid: false };
    const expectedSig = createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    const sigBuf1 = Buffer.from(signature, 'base64url');
    const sigBuf2 = Buffer.from(expectedSig, 'base64url');
    if (sigBuf1.length !== sigBuf2.length) return { valid: false };
    if (!timingSafeEqual(sigBuf1, sigBuf2)) return { valid: false };
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (payload.exp && Date.now() > payload.exp) return { valid: false };
    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

export function encryptField(plaintext: string): string {
  const iv = randomBytes(12).toString('hex');
  const key = scryptSync(ENCRYPTION_KEY, iv.slice(0, 16), 32);
  const { createCipheriv } = require('crypto');
  const cipher = createCipheriv('aes-256-gcm', key, Buffer.from(iv, 'hex'));
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv}:${authTag}:${encrypted}`;
}

export function decryptField(encryptedText: string): string {
  try {
    const [iv, authTag, encrypted] = encryptedText.split(':');
    const key = scryptSync(ENCRYPTION_KEY, iv.slice(0, 16), 32);
    const { createDecipheriv } = require('crypto');
    const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    return '[DECRYPTION_FAILED]';
  }
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return /^\+?[1-9]\d{6,14}$/.test(phone.replace(/\s/g, ''));
}

export function generateReference(prefix: string = 'CL'): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}${randomBytes(2).toString('hex').toUpperCase()}`;
}

export function rateLimitKey(ip: string, endpoint: string): string {
  return `rl:${createHmac('sha256', JWT_SECRET).update(`${ip}:${endpoint}`).digest('hex').slice(0, 16)}`;
}

export const ROLE_HIERARCHY: Record<string, number> = {
  guest: 0,
  user: 1,
  service_provider: 2,
  admin: 3,
  super_admin: 4,
};

export function hasRole(requiredRole: string, userRole: string): boolean {
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
}

export function maskSensitiveData(data: any, fields: string[] = ['password', 'passwordHash', 'encryptionKey']): any {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(item => maskSensitiveData(item, fields));
  const masked = { ...data };
  for (const field of fields) {
    if (field in masked) {
      masked[field] = '[REDACTED]';
    }
  }
  return masked;
}
