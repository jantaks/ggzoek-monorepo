import pino from 'pino';
import pino_caller from 'pino-caller';

const loglevel = process.env.LOG_LEVEL || 'info';

const pinoLogger = pino({
  level: loglevel,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      // ignore: 'pid,hostname',
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
}) // it will print as usual

export const log = pino_caller(pinoLogger) // it will print also the calling site
