require('winston-daily-rotate-file');
import * as winston from 'winston';
const { format } = winston;

// Define custom log format with colors
const logFormat = format.combine(
    format.colorize(),
    format.errors({ stack: true }),
    format.timestamp({ format: 'MM/DD/YYYY, h:mm:ss A' }),
    // format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
    format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),

    format.printf(({ level, message, timestamp, metadata }) => {
        let logMessage = `[Console] - [${timestamp}] ${
            level.includes('info') ? level.replace(/info/g, 'LOG') : level.includes('error') ? level.replace(/error/g, 'ERROR') : level
        }: ${JSON.stringify(message, null, 2)}`;

        if (metadata) {
            const { stack, ...meta } = metadata;

            if (stack) {
                logMessage += `\n${stack}`;
            }

            if (Object.keys(meta).length > 0) {
                logMessage += `\n${JSON.stringify(meta, null, 2)}`;
            }
        }

        return logMessage;
    }),
);

// Create a Winston logger instance with transports
export const logger = winston.createLogger({
    level: 'info',
    // format: logFormat,
    format: format.errors({ stack: true }), // This format is used as a base

    transports: [
        new winston.transports.Console({
            format: format.combine(format.colorize(), logFormat),
        }),
    ],
});
export default logger;
