import mongoose from "mongoose";
import logger from "../utils/logger.js";

export const connectDB = async () => {
  const mongoUri =
    process.env.MONGO_URI || "mongodb://localhost:27017/backend-template";
  try {
    await mongoose.connect(mongoUri);
    logger.info("MongoDB connected");
  } catch (err) {
    logger.error("MongoDB connection error:", { stack: err.stack });
    process.exit(1);
  }
};
