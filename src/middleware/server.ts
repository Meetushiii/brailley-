import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimitConfig, securityConfig } from '../config/server';
import { Pool } from 'pg';
import { dbPoolConfig } from '../config/server';
import Redis from 'ioredis';
import { cacheConfig } from '../config/server';

// Initialize database connection pool
export const dbPool = new Pool(dbPoolConfig);

// Initialize Redis cache
export const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});

// Rate limiting middleware
export const rateLimiter = rateLimit(rateLimitConfig);

// CORS middleware
export const corsMiddleware = cors({
  origin: securityConfig.corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 hours
});

// Security middleware
export const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.mapbox.com'],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: 'same-site' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
});

// Compression middleware
export const compressionMiddleware = compression({
  level: 6,
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
});

// Database connection middleware
export const dbMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const client = await dbPool.connect();
    req.dbClient = client;
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  } finally {
    if (req.dbClient) {
      req.dbClient.release();
    }
  }
};

// Cache middleware
export const cacheMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.method !== 'GET') {
    return next();
  }

  const key = `cache:${req.originalUrl}`;
  
  try {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    
    // Store original res.json
    const originalJson = res.json;
    res.json = function(data: any) {
      redisClient.setex(key, cacheConfig.ttl, JSON.stringify(data));
      return originalJson.call(this, data);
    };
    
    next();
  } catch (error) {
    console.error('Cache error:', error);
    next();
  }
};

// Error handling middleware
export const errorHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  res.status(500).json({ error: 'Internal server error' });
};

// Request logging middleware
export const requestLogger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  
  next();
};

// Apply all middleware to an Express app
export const applyMiddleware = (app: express.Application) => {
  app.use(requestLogger);
  app.use(securityMiddleware);
  app.use(corsMiddleware);
  app.use(compressionMiddleware);
  app.use(rateLimiter);
  app.use(dbMiddleware);
  app.use(cacheMiddleware);
  app.use(errorHandler);
}; 