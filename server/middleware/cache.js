const redis = require('redis');
const { promisify } = require('util');
const { logger } = require('./errorHandler');

// Create Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD,
  retry_strategy: function(options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  }
});

// Promisify Redis methods
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

// Handle Redis errors
redisClient.on('error', (err) => {
  logger.error('Redis Client Error', err);
});

// Cache middleware
const cache = (duration) => {
  return async (req, res, next) => {
    // Skip cache for authenticated requests or non-GET methods
    if (req.user || req.method !== 'GET') {
      return next();
    }

    const key = `ajira-cache:${req.originalUrl || req.url}`;

    try {
      const cachedResponse = await getAsync(key);

      if (cachedResponse) {
        const data = JSON.parse(cachedResponse);
        return res.json(data);
      }

      // Override res.json to cache the response
      const originalJson = res.json;
      res.json = function(body) {
        setAsync(key, JSON.stringify(body), 'EX', duration)
          .catch(err => logger.error('Redis Set Error:', err));
        
        return originalJson.call(this, body);
      };

      next();
    } catch (err) {
      logger.error('Cache Middleware Error:', err);
      next();
    }
  };
};

// Clear cache by pattern
const clearCache = async (pattern) => {
  try {
    const keys = await promisify(redisClient.keys).bind(redisClient)(`ajira-cache:${pattern}`);
    if (keys.length > 0) {
      await delAsync(keys);
      logger.info(`Cleared cache for pattern: ${pattern}`);
    }
  } catch (err) {
    logger.error('Clear Cache Error:', err);
  }
};

// Cache durations (in seconds)
const CACHE_DURATIONS = {
  SHORT: 300,      // 5 minutes
  MEDIUM: 1800,    // 30 minutes
  LONG: 7200,      // 2 hours
  VERY_LONG: 86400 // 24 hours
};

module.exports = {
  cache,
  clearCache,
  CACHE_DURATIONS,
  redisClient
}; 