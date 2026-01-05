import { transports, format } from 'winston';
import 'winston-daily-rotate-file';

export const winstonConfig = {
  transports: [
    // Console transport
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.ms(),
        format.colorize(),
        format.printf(({ timestamp, level, message, ms, context }) => {
          const contextLabel =
            typeof context === 'string' ? context : 'Application';
          return `${timestamp as string} [${contextLabel}] ${level}: ${message as string} ${ms as string}`;
        }),
      ),
    }),

    // File transport for all logs
    new transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: format.combine(format.timestamp(), format.json()),
    }),

    // File transport for error logs only
    new transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d', // Keep errors longer
      level: 'error',
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
};
