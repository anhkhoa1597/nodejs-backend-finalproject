import bcrypt from "bcrypt";
import logger from "./logger.js"; // Assuming you have a logger utility
import { InternalServerError } from "../middlewares/errorHandler.js";

const saltRounds = 10;

export const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    logger.info("Password hashed successfully");
    return hashedPassword;
  } catch (error) {
    logger.error("Error hashing password", { stack: error.stack });
    throw new InternalServerError("Error hashing password: " + error.message);
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    logger.info("Password comparison successful");
    return isMatch;
  } catch (error) {
    logger.error("Error comparing password", { stack: error.stack });
    throw new InternalServerError("Error comparing password: " + error.message);
  }
};
