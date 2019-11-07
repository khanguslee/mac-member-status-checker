import winston from 'winston';
import fs from 'fs';
import path from 'path';

const logDir = 'log';
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const combinedLogFilename = 'combined.log';
const errorLogFilename = 'error.log';

const defaultFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.printf(
    info => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);
const loggerOptions = {
  combined: {
    level: 'info',
    filename: path.join(logDir, combinedLogFilename),
    handleExceptions: true,
    format: winston.format.combine(defaultFormat, winston.format.json()),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  },
  error: {
    level: 'error',
    filename: path.join(logDir, errorLogFilename),
    format: winston.format.combine(defaultFormat, winston.format.json()),
  },
  debug: {
    level: 'debug',
    handleExceptions: true,
    format: winston.format.combine(winston.format.colorize(), defaultFormat),
  },
};

const logger = winston.createLogger({
  format: defaultFormat,
  transports: [
    new winston.transports.File(loggerOptions.combined),
    new winston.transports.File(loggerOptions.error),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console(loggerOptions.debug));
}

module.exports = logger;
