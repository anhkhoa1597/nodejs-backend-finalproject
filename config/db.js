import mongoose from "mongoose";
import logger from "../utils/logger.js";
import config from "./config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri, { dbName: config.dbName });
    logger.info("MongoDB connected");
  } catch (err) {
    logger.error("MongoDB connection error:", { stack: err.stack });
    process.exit(1);
  }
};
