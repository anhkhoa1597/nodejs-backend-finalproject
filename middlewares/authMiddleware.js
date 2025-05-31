import logger from "../utils/logger.js";
import { UnauthorizedError } from "../middlewares/errorHandler.js";
import { verifyToken } from "../utils/tokenUtils.js";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    logger.warn("No token provided");
    return next(new UnauthorizedError("Token required"));
  }

  try {
    const decodedUser = verifyToken(token);
    req.user = decodedUser;
    logger.info("Token verified successfully", { user: decodedUser.username });
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.redirect("/login");

  try {
    const decodedUser = verifyToken(token);
    req.user = decodedUser;
    logger.info("Token verified successfully", { user: decodedUser.username });
    next();
  } catch (error) {
    return res.redirect("/login");
  }
};

export default authenticateToken;
