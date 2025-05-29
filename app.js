import express from "express";
import userRoutes from "./routes/user.routes.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler, NotFoundError } from "./middlewares/errorHandler.js";
import logger from "./utils/logger.js";
import config from "./config/config.js";

const app = express();
const { nodeEnv, frontendUrl } = config;
// region 🛡️ Middleware
// Enable CORS
app.use(
  cors({
    origin: frontendUrl || "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allow cross-origin resource sharing
  })
); // Use Helmet for security headers
app.use(express.json()); // Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data
// Middleware for logging HTTP requests
if (nodeEnv === "development") {
  app.use(morgan("dev")); // Use 'dev' format for development
} else {
  app.use(
    morgan("combined", {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  ); // Use 'combined' format for production
}
// endregion

// region 📂 Routes
app.use("/users", userRoutes); // Import user routes
// Basic route
app.get("/", (req, res) => {
  logger.info("Root route accessed");
  res.json({ message: "Welcome to the backend template!" });
});
// endregion

// 404 handler
app.use((req, res, next) => {
  logger.warn(`404 Not Found: ${req.originalUrl}`);
  next(new NotFoundError("Resource not found"));
});

// Centralized error handler
app.use(errorHandler);

export default app;
