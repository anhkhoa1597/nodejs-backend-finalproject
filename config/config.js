import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongoUri:
    process.env.MONGO_URI || "mongodb://localhost:27017/backend-template",
  nodeEnv: process.env.NODE_ENV || "development",

  jwt: {
    secret: process.env.JWT_SECRET || "secretkey",
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  },

  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: process.env.CORS_CREDENTIALS === "true",
  },

  log: {
    level: process.env.LOG_LEVEL || "info",
    file: process.env.LOG_FILE_PATH || "logs/combined.log",
    errorFile: process.env.LOG_ERROR_FILE_PATH || "logs/error.log",
    debugFile: process.env.LOG_DEBUG_FILE_PATH || "logs/debug.log",
  },
};

export default config;
