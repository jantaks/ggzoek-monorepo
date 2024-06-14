import winston, { format, Logger } from 'winston';
import * as path from 'node:path';

const { combine, timestamp, colorize, align, printf, metadata, errors } = winston.format;

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};

const customFormat = format((info) => {
  const obj: { stack?: string } = {};
  Error.stackTraceLimit = 20;
  Error.captureStackTrace(obj);
  const stack = obj.stack!.split('\n');

  // Find the first call site outside the logger module
  let caller = stack[11];
  if (caller.includes('process.processTicksAndRejections')) {
    caller = stack[10];
  }

  const match = caller.match(/\(([^)]+)\)/);

  if (match) {
    const location = match[1].split(':');
    info.file = path.basename(location[0]);
    info.line = location[1];
  } else {
    // For cases without the (filename:line:column) format
    const parts = caller.split(' ');
    if (parts.length > 1) {
      const location = parts[parts.length - 1].split(':');
      info.file = path.basename(location[0]);
      info.line = location[1];
    } else {
      info.file = 'unknown';
      info.line = 'unknown';
    }
  }

  return info;
})();

function getFormatter(info: any) {
  let format = `${info.timestamp} ${info.level} ${info.file}:${info.line} ${info.message}`;
  if (info.metadata.scraper) {
    format = `${format} (Scraper: ${info.metadata.scraper})`;
  }
  if (info.metadata.json) {
    format = `${format} ${JSON.stringify(info.metadata.json)}`;
  }
  if (info.stack) {
    format = `${format}\n\t${info.stack}`;
  }
  return format;
}

export const log = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: combine(
    customFormat,
    errors({ stack: true }),
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS'
    }),
    align(),
    metadata({ fillWith: ['scraper'] }),
    printf((info) => getFormatter(info))
  ),
  transports: [new winston.transports.Console()]
});

// it will print also the calling site
log.info(process.env.LOG_LEVEL);
export type MyLogger = Logger;
