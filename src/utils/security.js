import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Security Configuration
const SECURITY_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_key_change_in_production',
  SALT_ROUNDS: 12,
  TOKEN_EXPIRY: '1h',
  RATE_LIMIT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};

// Input Validation Utility
export const validateInput = {
  email: (email) => {
    if (!validator.isEmail(email)) {
      throw new Error('Invalid email format');
    }
    return true;
  },
  
  password: (password) => {
    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) {
      throw new Error('Password is too weak');
    }
    return true;
  },
  
  sanitizeInput: (input) => {
    return validator.escape(input.trim());
  }
};

// Password Hashing Utility
export const passwordUtils = {
  hashPassword: async (password) => {
    return await bcrypt.hash(password, SECURITY_CONFIG.SALT_ROUNDS);
  },
  
  comparePassword: async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
};

// JWT Token Management
export const tokenManager = {
  generateToken: (payload) => {
    return jwt.sign(payload, SECURITY_CONFIG.JWT_SECRET, {
      expiresIn: SECURITY_CONFIG.TOKEN_EXPIRY
    });
  },
  
  verifyToken: (token) => {
    try {
      return jwt.verify(token, SECURITY_CONFIG.JWT_SECRET);
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return null;
    }
  }
};

// Advanced Security Middleware
export const securityMiddleware = {
  // Prevent brute-force attacks
  rateLimiter: (req, res, next) => {
    const attempts = req.session.loginAttempts || 0;
    if (attempts >= 5) {
      return res.status(429).json({ 
        message: 'Too many login attempts. Please try again later.' 
      });
    }
    req.session.loginAttempts = attempts + 1;
    next();
  },

  // Validate and sanitize all inputs
  sanitizeInputs: (req, res, next) => {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = validator.escape(req.body[key].trim());
      }
    });
    next();
  },

  // JWT Authentication Middleware
  authenticateToken: (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = tokenManager.verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded;
    next();
  }
};

export default {
  validateInput,
  passwordUtils,
  tokenManager,
  securityMiddleware,
  SECURITY_CONFIG
};
