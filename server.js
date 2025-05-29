import app from "./app.js";
import { connectDB } from "./config/db.js";
import logger from "./utils/logger.js";
import config from "./config/config.js";

const { port } = config;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    logger.error("Failed to start server", { stack: error.stack });
    process.exit(1);
  }
};

startServer();
