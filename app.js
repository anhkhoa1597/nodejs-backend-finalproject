import express from "express";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler, NotFoundError } from "./middlewares/errorHandler.js";
import logger from "./utils/logger.js";
import config from "./config/config.js";
import authenticateToken, {
  requireAuth,
} from "./middlewares/authMiddleware.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.use(express.static(path.join(__dirname, "public")));

// region 📂 Routes
app.use("/users", userRoutes); // Import user routes
app.use("/posts", postRoutes); // Import post routes
// HTML route
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);
app.get("/register", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "register.html"))
);
app.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "login.html"))
);
app.get("/post", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "post.html"))
);
app.get("/index", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);
// endregion

// 404 handler
app.use((req, res, next) => {
  logger.warn(`404 Not Found: ${req.originalUrl}`);
  next(new NotFoundError("Resource not found"));
});

// Centralized error handler
app.use(errorHandler);

export default app;
