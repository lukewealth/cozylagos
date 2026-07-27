import { verifyJWT, hasRole, sanitizeInput, rateLimitKey } from './security';

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const auditLogStore: any[] = [];
const MAX_AUDIT_LOGS = 10000;

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
  // HTTP Strict Transport Security (HSTS) - Enforce HTTPS
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // XSS Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;");
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Cache Control for sensitive data
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
}

export function logAudit(action: string, userId: string, details: Record<string, any> = {}): void {
  const logEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    action,
    userId,
    details,
    ip: 'server-side',
    userAgent: 'server',
  };
  
  auditLogStore.push(logEntry);
  
  // Keep only the last MAX_AUDIT_LOGS entries
  if (auditLogStore.length > MAX_AUDIT_LOGS) {
    auditLogStore.splice(0, auditLogStore.length - MAX_AUDIT_LOGS);
  }
  
  console.log(`[AUDIT] ${JSON.stringify(logEntry)}`);
}

export function getAuditLogs(filters?: { userId?: string; action?: string; startDate?: string; endDate?: string }): any[] {
  let logs = [...auditLogStore];
  
  if (filters?.userId) {
    logs = logs.filter(log => log.userId === filters.userId);
  }
  if (filters?.action) {
    logs = logs.filter(log => log.action === filters.action);
  }
  if (filters?.startDate) {
    logs = logs.filter(log => new Date(log.timestamp) >= new Date(filters.startDate!));
  }
  if (filters?.endDate) {
    logs = logs.filter(log => new Date(log.timestamp) <= new Date(filters.endDate!));
  }
  
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Security Monitoring
export function detectSecurityThreat(req: any): { isThreat: boolean; threatType?: string; severity?: string } {
  const userAgent = req.headers?.['user-agent'] || '';
  const ip = req.headers?.['x-forwarded-for'] || req.headers?.['x-real-ip'] || 'unknown';
  
  // Check for common attack patterns in user agent
  const suspiciousAgents = ['sqlmap', 'nikto', 'nmap', 'masscan', 'zgrab'];
  if (suspiciousAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    return { isThreat: true, threatType: 'SUSPICIOUS_USER_AGENT', severity: 'high' };
  }
  
  // Check for SQL injection patterns in URL
  const sqlPatterns = ['union select', 'or 1=1', 'drop table', 'insert into'];
  const url = (req.url || '').toLowerCase();
  if (sqlPatterns.some(pattern => url.includes(pattern))) {
    return { isThreat: true, threatType: 'SQL_INJECTION_ATTEMPT', severity: 'critical' };
  }
  
  // Check for XSS patterns
  const xssPatterns = ['<script', 'javascript:', 'onerror='];
  if (xssPatterns.some(pattern => url.includes(pattern))) {
    return { isThreat: true, threatType: 'XSS_ATTEMPT', severity: 'high' };
  }
  
  return { isThreat: false };
}

export function logSecurityEvent(event: {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
  ip?: string;
  userId?: string;
}): void {
  const logEntry = {
    id: `security_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    ...event,
  };
  
  console.log(`[SECURITY] ${event.severity.toUpperCase()}: ${JSON.stringify(logEntry)}`);
  
  // For critical events, you might want to trigger alerts
  if (event.severity === 'critical') {
    // In production, integrate with alerting system (Slack, PagerDuty, etc.)
    console.error(`[ALERT] Critical security event detected:`, logEntry);
  }
}

