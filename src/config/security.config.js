// Comprehensive Security Configuration

export const SECURITY_SETTINGS = {
  // Content Security Policy
  CSP: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'", 
      "'unsafe-inline'", 
      'https://cdn.jsdelivr.net',
      'https://unpkg.com',
      'https://cdnjs.cloudflare.com'
    ],
    styleSrc: [
      "'self'", 
      "'unsafe-inline'", 
      'https://fonts.googleapis.com'
    ],
    imgSrc: ["'self'", 'data:', 'https:'],
    fontSrc: [
      "'self'", 
      'https://fonts.gstatic.com'
    ],
    connectSrc: ["'self'"],
    frameSrc: ["'none'"]
  },

  // HTTP Security Headers
  HEADERS: {
    'X-XSS-Protection': '1; mode=block',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  },

  // Rate Limiting Configuration
  RATE_LIMIT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later',
    standardHeaders: true, // Return rate limit info in RateLimit-* headers
    legacyHeaders: false // Disable X-RateLimit-* headers
  },

  // Input Validation Rules
  VALIDATION: {
    email: {
      minLength: 5,
      maxLength: 100,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      minLength: 8,
      maxLength: 64,
      requireSpecialChar: true,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true
    }
  },

  // Authentication Settings
  AUTH: {
    tokenExpiry: '1h',
    refreshTokenExpiry: '7d',
    saltRounds: 12
  },

  // Logging and Monitoring
  LOGGING: {
    level: 'warn',
    maxSize: '10m',
    maxFiles: 5
  }
};

export default SECURITY_SETTINGS;
