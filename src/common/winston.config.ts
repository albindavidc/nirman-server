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

    // File transport with rotation
    new transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d', // 14 days retention
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
};
