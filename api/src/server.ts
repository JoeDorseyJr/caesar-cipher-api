import { app } from "./app";
import { config } from "./config";
import { logger } from "./utils/logger";

const server = Bun.serve({
  port: config.PORT,
  fetch: app.fetch,
});

logger.info("Server started", {
  port: server.port,
  environment: config.NODE_ENV,
  url: `http://localhost:${server.port}`,
});
