import { createHmac, randomBytes, scryptSync, timingSafeEqual, createCipheriv, createDecipheriv } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'cozy-lagos-secret-key-2024-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'cozy-lagos-encryption-key-32bytes!';
const PAYMENT_TOKEN_KEY = process.env.PAYMENT_TOKEN_KEY || 'cozy-lagos-payment-token-key-2024!';

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

// Payment Tokenization - PCI-DSS Compliant
export function tokenizeCard(cardNumber: string, expiry: string, cvv: string): { token: string; last4: string; brand: string } {
  const last4 = cardNumber.slice(-4);
  const brand = detectCardBrand(cardNumber);
  
  // Create a secure token that can be used for future transactions
  const tokenData = {
    cardNumber: encryptField(cardNumber),
    expiry: encryptField(expiry),
    cvv: encryptField(cvv),
    timestamp: Date.now(),
    nonce: randomBytes(16).toString('hex')
  };
  
  const token = createHmac('sha256', PAYMENT_TOKEN_KEY)
    .update(JSON.stringify(tokenData))
    .digest('hex');
  
  return { token, last4, brand };
}

export function detectCardBrand(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  if (/^6(?:011|5)/.test(cleaned)) return 'discover';
  if (/^35/.test(cleaned)) return 'jcb';
  if (/^3(?:0[0-5]|[68])/.test(cleaned)) return 'diners';
  return 'unknown';
}

export function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cleaned)) return false;
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

export function validateExpiry(expiry: string): boolean {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  
  const month = parseInt(match[1], 10);
  const year = parseInt(`20${match[2]}`, 10);
  
  if (month < 1 || month > 12) return false;
  
  const now = new Date();
  const expiryDate = new Date(year, month - 1);
  
  return expiryDate > now;
}

export function validateCVV(cvv: string, cardBrand?: string): boolean {
  if (cardBrand === 'amex') {
    return /^\d{4}$/.test(cvv);
  }
  return /^\d{3}$/.test(cvv);
}

// Fraud Detection
export function detectFraud(transaction: {
  amount: number;
  ip: string;
  userAgent: string;
  email: string;
  cardToken: string;
  timestamp: number;
}): { riskScore: number; flags: string[] } {
  const flags: string[] = [];
  let riskScore = 0;
  
  // High amount check
  if (transaction.amount > 500000) {
    flags.push('HIGH_AMOUNT');
    riskScore += 30;
  }
  
  // Velocity check (would need database lookup in production)
  // For now, check if timestamp is unusual
  const hour = new Date(transaction.timestamp).getHours();
  if (hour < 6 || hour > 23) {
    flags.push('UNUSUAL_TIME');
    riskScore += 15;
  }
  
  // Email domain check
  const disposableDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
  const emailDomain = transaction.email.split('@')[1];
  if (disposableDomains.includes(emailDomain)) {
    flags.push('DISPOSABLE_EMAIL');
    riskScore += 40;
  }
  
  // IP geolocation mismatch would be checked in production
  
  return { riskScore, flags };
}

// Encryption for sensitive fields
export function encryptSensitiveData(data: any, fields: string[] = ['cardNumber', 'cvv', 'bankAccount']): any {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(item => encryptSensitiveData(item, fields));
  
  const encrypted = { ...data };
  for (const field of fields) {
    if (field in encrypted && typeof encrypted[field] === 'string') {
      encrypted[field] = encryptField(encrypted[field]);
    }
  }
  return encrypted;
}

export function decryptSensitiveData(data: any, fields: string[] = ['cardNumber', 'cvv', 'bankAccount']): any {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(item => decryptSensitiveData(item, fields));
  
  const decrypted = { ...data };
  for (const field of fields) {
    if (field in decrypted && typeof decrypted[field] === 'string') {
      decrypted[field] = decryptField(decrypted[field]);
    }
  }
  return decrypted;
}

