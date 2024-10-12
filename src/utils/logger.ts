import { DateTime } from 'luxon';
import pino from 'pino';
import pinoPretty from 'pino-pretty';

const prettyPrint = pinoPretty({
  colorize: true, // Enables colors in the output
  translateTime: 'SYS:standard', // Translates time to human-readable format
  ignore: 'pid,hostname', // Hides pid and hostname from logs
});

const logLevel = process.env.NODE_ENV === 'test' ? 'error' : 'info'; // Suppress warnings in test mode

const log = pino(
  {
    level: logLevel,
    base: {
      pid: false,
    },
    timestamp: () => `,"time":"${DateTime.now().toISO()}"`, // ISO format for timestamp
  },
  prettyPrint,
);

export default log;
