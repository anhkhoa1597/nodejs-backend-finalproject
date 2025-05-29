import winston from "winston";
const { combine, timestamp, printf, errors, colorize, label } = winston.format;

// Create a custom format for the logger
const logFormat = printf((info) => {
  return `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message}${
    info.stack ? `\nStack: ${info.stack}` : ""
  }`;
});

let customFormat = combine(
  timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  errors({ stack: true }), // Include stack trace for errors
  logFormat
);

let customFormatwithColor = combine(
  timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  errors({ stack: true }), // Include stack trace for errors
  logFormat,
  colorize({ all: true }) // Colorize all log levels
);

// Create a logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: customFormat,
  transports: [
    new winston.transports.Console({
      format: customFormatwithColor,
    }), // Console transport for development
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    new winston.transports.File({ filename: "logs/debug.log", level: "debug" }),
  ],
});
export default logger;