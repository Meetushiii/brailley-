import { z } from 'zod';

// Server configuration schema
const serverConfigSchema = z.object({
  // API configuration
  api: z.object({
    baseUrl: z.string().url(),
    timeout: z.number().min(1000).max(30000),
    retryAttempts: z.number().min(1).max(5),
    rateLimit: z.object({
      windowMs: z.number().min(1000).max(3600000), // 1 second to 1 hour
      max: z.number().min(10).max(1000), // Max requests per window
    }),
  }),

  // Database configuration
  database: z.object({
    url: z.string().url(),
    poolSize: z.number().min(5).max(100),
    connectionTimeout: z.number().min(1000).max(30000),
    idleTimeout: z.number().min(1000).max(300000),
  }),

  // Cache configuration
  cache: z.object({
    enabled: z.boolean(),
    ttl: z.number().min(60).max(86400), // 1 minute to 24 hours
    maxSize: z.number().min(100).max(10000), // Max items in cache
  }),

  // Email service configuration
  email: z.object({
    provider: z.enum(['smtp', 'sendgrid', 'aws-ses']),
    fromAddress: z.string().email(),
    rateLimit: z.number().min(10).max(1000), // Emails per minute
  }),

  // Security configuration
  security: z.object({
    jwtSecret: z.string().min(32),
    jwtExpiry: z.number().min(300).max(86400), // 5 minutes to 24 hours
    bcryptRounds: z.number().min(10).max(14),
    corsOrigins: z.array(z.string().url()),
  }),

  // Monitoring configuration
  monitoring: z.object({
    enabled: z.boolean(),
    metricsInterval: z.number().min(1000).max(60000), // 1 second to 1 minute
    logLevel: z.enum(['error', 'warn', 'info', 'debug']),
  }),
});

// Default configuration optimized for high traffic
const defaultConfig = {
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
    timeout: 10000,
    retryAttempts: 3,
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // 100 requests per window
    },
  },

  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/braille_math_verse',
    poolSize: 20,
    connectionTimeout: 10000,
    idleTimeout: 30000,
  },

  cache: {
    enabled: true,
    ttl: 3600, // 1 hour
    maxSize: 1000,
  },

  email: {
    provider: 'sendgrid',
    fromAddress: 'noreply@braillemathverse.com',
    rateLimit: 100, // 100 emails per minute
  },

  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-secure-jwt-secret-key-min-32-chars',
    jwtExpiry: 3600, // 1 hour
    bcryptRounds: 12,
    corsOrigins: [
      'https://braillemathverse.com',
      'https://www.braillemathverse.com',
    ],
  },

  monitoring: {
    enabled: true,
    metricsInterval: 5000, // 5 seconds
    logLevel: 'info',
  },
};

// Validate and export configuration
export const serverConfig = serverConfigSchema.parse(defaultConfig);

// Helper functions for configuration
export const getApiConfig = () => serverConfig.api;
export const getDatabaseConfig = () => serverConfig.database;
export const getCacheConfig = () => serverConfig.cache;
export const getEmailConfig = () => serverConfig.email;
export const getSecurityConfig = () => serverConfig.security;
export const getMonitoringConfig = () => serverConfig.monitoring;

// Rate limiting middleware configuration
export const rateLimitConfig = {
  windowMs: serverConfig.api.rateLimit.windowMs,
  max: serverConfig.api.rateLimit.max,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
};

// Database connection pool configuration
export const dbPoolConfig = {
  max: serverConfig.database.poolSize,
  idleTimeoutMillis: serverConfig.database.idleTimeout,
  connectionTimeoutMillis: serverConfig.database.connectionTimeout,
};

// Cache configuration
export const cacheConfig = {
  ttl: serverConfig.cache.ttl,
  max: serverConfig.cache.maxSize,
  checkPeriod: 600, // Check for expired items every 10 minutes
};

// Email service configuration
export const emailConfig = {
  provider: serverConfig.email.provider,
  fromAddress: serverConfig.email.fromAddress,
  rateLimit: serverConfig.email.rateLimit,
};

// Security configuration
export const securityConfig = {
  jwtSecret: serverConfig.security.jwtSecret,
  jwtExpiry: serverConfig.security.jwtExpiry,
  bcryptRounds: serverConfig.security.bcryptRounds,
  corsOrigins: serverConfig.security.corsOrigins,
};

// Monitoring configuration
export const monitoringConfig = {
  enabled: serverConfig.monitoring.enabled,
  metricsInterval: serverConfig.monitoring.metricsInterval,
  logLevel: serverConfig.monitoring.logLevel,
}; 