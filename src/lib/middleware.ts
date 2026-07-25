import { verifyJWT, hasRole, sanitizeInput, rateLimitKey } from './security';

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function authenticateRequest(req: any): { authenticated: boolean; user?: any; error?: string } {
  const authHeader = req.headers?.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authenticated: false, error: 'No authorization token provided' };
  }
  const token = authHeader.split(' ')[1];
  const result = verifyJWT(token);
  if (!result.valid) {
    return { authenticated: false, error: 'Invalid or expired token' };
  }
  return { authenticated: true, user: result.payload };
}

export function authorizeRole(requiredRole: string, userRole: string): boolean {
  return hasRole(requiredRole, userRole);
}

export function checkRateLimit(req: any, maxRequests: number = 100, windowMs: number = 60000): { allowed: boolean; remaining: number; resetAt: number } {
  const ip = req.headers?.['x-forwarded-for'] || req.headers?.['x-real-ip'] || 'unknown';
  const endpoint = req.url || 'unknown';
  const key = rateLimitKey(ip, endpoint);
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }
  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }
  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}

export function validateRequestBody(body: any, schema: Record<string, { type: string; required?: boolean; min?: number; max?: number; pattern?: RegExp }>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  for (const [field, rules] of Object.entries(schema)) {
    const value = body[field];
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      continue;
    }
    if (value === undefined || value === null) continue;
    if (rules.type === 'string' && typeof value !== 'string') {
      errors.push(`${field} must be a string`);
    }
    if (rules.type === 'number' && typeof value !== 'number') {
      errors.push(`${field} must be a number`);
    }
    if (rules.type === 'boolean' && typeof value !== 'boolean') {
      errors.push(`${field} must be a boolean`);
    }
    if (rules.type === 'string' && typeof value === 'string') {
      if (rules.min && value.length < rules.min) errors.push(`${field} must be at least ${rules.min} characters`);
      if (rules.max && value.length > rules.max) errors.push(`${field} must be at most ${rules.max} characters`);
      if (rules.pattern && !rules.pattern.test(value)) errors.push(`${field} has invalid format`);
    }
    if (rules.type === 'number' && typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) errors.push(`${field} must be at least ${rules.min}`);
      if (rules.max !== undefined && value > rules.max) errors.push(`${field} must be at most ${rules.max}`);
    }
  }
  return { valid: errors.length === 0, errors };
}

export function sanitizeRequestBody(body: any, fields: string[]): any {
  const sanitized = { ...body };
  for (const field of fields) {
    if (typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizeInput(sanitized[field]);
    }
  }
  return sanitized;
}

export function addSecurityHeaders(res: any): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'");
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
}

export function logAudit(action: string, userId: string, details: Record<string, any> = {}): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    userId,
    ...details,
    ip: 'server-side',
  };
  console.log(`[AUDIT] ${JSON.stringify(logEntry)}`);
}
