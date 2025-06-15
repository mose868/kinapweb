const winston = require('winston');
const path = require('path');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define log directory
const logDir = path.join(__dirname, '../logs');

// Create logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: logFormat,
  defaultMeta: { service: 'ajira-digital' },
  transports: [
    // Write all logs with level 'error' and below to 'error.log'
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Write all logs with level 'info' and below to 'combined.log'
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Create a stream object for Morgan
logger.stream = {
  write: (message) => logger.info(message.trim())
};

// Helper functions for common log patterns
logger.logAuthAttempt = (email, success, reason = '') => {
  const level = success ? 'info' : 'warn';
  logger[level]('Authentication attempt', {
    email,
    success,
    reason,
    ip: this.requestIp,
    userAgent: this.userAgent
  });
};

logger.logRateLimit = (ip, endpoint) => {
  logger.warn('Rate limit exceeded', {
    ip,
    endpoint,
    timestamp: new Date().toISOString()
  });
};

logger.logSecurityEvent = (type, details) => {
  logger.warn('Security event detected', {
    type,
    details,
    timestamp: new Date().toISOString()
  });
};

logger.logAPIError = (error, req) => {
  logger.error('API Error', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
};

module.exports = logger; 