// Security Configuration for Cozy Lagos
// Implements industry-standard security protocols

export const SECURITY_CONFIG = {
  // SSL/TLS Configuration
  ssl: {
    enabled: true,
    minVersion: 'TLSv1.3',
    ciphers: [
      'TLS_AES_256_GCM_SHA384',
      'TLS_CHACHA20_POLY1305_SHA256',
      'TLS_AES_128_GCM_SHA256',
    ],
    enforceHTTPS: true,
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
  },

  // Certificate Pinning
  certificatePinning: {
    enabled: true,
    pins: [
      // Add your certificate pins here
      // Example: 'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
    ],
    reportUri: '/api/security/certificate-violation',
    reportOnly: false,
  },

  // Encryption Configuration
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 256,
    ivLength: 12,
    authTagLength: 16,
    // Fields to encrypt in database
    sensitiveFields: [
      'cardNumber',
      'cvv',
      'bankAccount',
      'ssn',
      'passportNumber',
      'driversLicense',
    ],
  },

  // Password Policy
  passwordPolicy: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAge: 90, // days
    history: 5, // prevent reuse of last 5 passwords
    lockoutAttempts: 5,
    lockoutDuration: 15, // minutes
  },

  // Session Configuration
  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: true,
    httpOnly: true,
    sameSite: 'strict' as const,
    rolling: true,
  },

  // CORS Configuration
  cors: {
    allowedOrigins: [
      'https://cozylagos.com',
      'https://www.cozylagos.com',
      'https://cozylagos.vercel.app',
    ],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400, // 24 hours
  },

  // Rate Limiting
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    // Stricter limits for sensitive endpoints
    sensitiveEndpoints: {
      '/api/auth/login': { windowMs: 15 * 60 * 1000, maxRequests: 5 },
      '/api/auth/register': { windowMs: 60 * 60 * 1000, maxRequests: 3 },
      '/api/payments': { windowMs: 60 * 1000, maxRequests: 10 },
    },
  },

  // Audit Logging
  auditLogging: {
    enabled: true,
    retentionDays: 365,
    logLevel: 'info',
    events: [
      'AUTH_SUCCESS',
      'AUTH_FAILURE',
      'PASSWORD_CHANGE',
      'DATA_ACCESS',
      'DATA_MODIFICATION',
      'DATA_DELETION',
      'PAYMENT_PROCESSING',
      'ADMIN_ACTION',
      'SECURITY_EVENT',
    ],
  },

  // Backup Configuration
  backup: {
    enabled: true,
    frequency: 'daily',
    retentionDays: 30,
    encryptionEnabled: true,
    offsiteBackup: true,
    backupLocations: [
      'mongodb-atlas',
      'aws-s3',
    ],
  },

  // Monitoring Configuration
  monitoring: {
    enabled: true,
    alertThresholds: {
      failedAuthAttempts: 10,
      rateLimitViolations: 50,
      errorRate: 0.05, // 5%
      responseTime: 2000, // 2 seconds
    },
    notificationChannels: [
      'email',
      'slack',
      'pagerduty',
    ],
  },

  // Compliance Configuration
  compliance: {
    pciDSS: {
      enabled: true,
      version: '4.0',
      lastAudit: new Date().toISOString(),
      nextAudit: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    },
    ndpr: {
      enabled: true,
      lastAudit: new Date().toISOString(),
      nextAudit: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    },
    gdpr: {
      enabled: true,
      lastAudit: new Date().toISOString(),
      nextAudit: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
};

// Helper function to validate password strength
export function validatePasswordStrength(password: string): {
  valid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  const policy = SECURITY_CONFIG.passwordPolicy;

  if (password.length >= policy.minLength) {
    score += 20;
  } else {
    feedback.push(`Password must be at least ${policy.minLength} characters long`);
  }

  if (/[A-Z]/.test(password)) {
    score += 20;
  } else if (policy.requireUppercase) {
    feedback.push('Password must contain at least one uppercase letter');
  }

  if (/[a-z]/.test(password)) {
    score += 20;
  } else if (policy.requireLowercase) {
    feedback.push('Password must contain at least one lowercase letter');
  }

  if (/[0-9]/.test(password)) {
    score += 20;
  } else if (policy.requireNumbers) {
    feedback.push('Password must contain at least one number');
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 20;
  } else if (policy.requireSpecialChars) {
    feedback.push('Password must contain at least one special character');
  }

  return {
    valid: score === 100,
    score,
    feedback,
  };
}

// Helper function to check if origin is allowed
export function isOriginAllowed(origin: string): boolean {
  return SECURITY_CONFIG.cors.allowedOrigins.includes(origin);
}

// Helper function to get rate limit for endpoint
export function getRateLimitForEndpoint(endpoint: string): { windowMs: number; maxRequests: number } {
  const sensitiveConfig = SECURITY_CONFIG.rateLimiting.sensitiveEndpoints[endpoint as keyof typeof SECURITY_CONFIG.rateLimiting.sensitiveEndpoints];
  if (sensitiveConfig) {
    return sensitiveConfig;
  }
  return {
    windowMs: SECURITY_CONFIG.rateLimiting.windowMs,
    maxRequests: SECURITY_CONFIG.rateLimiting.maxRequests,
  };
}
