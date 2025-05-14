/**
 * Simple logger utility for the application
 * Provides consistent logging with timestamps and different log levels
 */

// Determine if we're in development or production
const isDevelopment = process.env.NODE_ENV !== 'production';

// Define log levels
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

// Set minimum log level based on environment
const MIN_LOG_LEVEL = isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;

/**
 * Format the current date and time for log messages
 */
function getTimestamp(): string {
  const now = new Date();
  return now.toISOString();
}

/**
 * Format a log message with timestamp and level
 */
function formatLogMessage(level: string, message: string, ...args: any[]): string {
  // Format any additional arguments
  let formattedArgs = '';
  if (args.length > 0) {
    formattedArgs = args.map(arg => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg, null, 2);
      }
      return arg;
    }).join(' ');
  }
  
  return `[${getTimestamp()}] [${level}] ${message} ${formattedArgs}`.trim();
}

// The logger object
export const logger = {
  debug(message: string, ...args: any[]): void {
    if (MIN_LOG_LEVEL <= LOG_LEVELS.DEBUG) {
      console.debug(formatLogMessage('DEBUG', message, ...args));
    }
  },
  
  info(message: string, ...args: any[]): void {
    if (MIN_LOG_LEVEL <= LOG_LEVELS.INFO) {
      console.info(formatLogMessage('INFO', message, ...args));
    }
  },
  
  warn(message: string, ...args: any[]): void {
    if (MIN_LOG_LEVEL <= LOG_LEVELS.WARN) {
      console.warn(formatLogMessage('WARN', message, ...args));
    }
  },
  
  error(message: string, ...args: any[]): void {
    if (MIN_LOG_LEVEL <= LOG_LEVELS.ERROR) {
      console.error(formatLogMessage('ERROR', message, ...args));
    }
  },
  
  // Special method for bitcoin transaction logs
  btc(message: string, ...args: any[]): void {
    if (MIN_LOG_LEVEL <= LOG_LEVELS.INFO) {
      console.info(formatLogMessage('BTC', message, ...args));
    }
  },
  
  // Special method for security-related logs
  security(message: string, ...args: any[]): void {
    // Always log security messages regardless of log level
    console.info(formatLogMessage('SECURITY', message, ...args));
  }
};

export default logger;