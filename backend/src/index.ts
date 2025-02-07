import "reflect-metadata";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { createConnection } from "typeorm";

import authRoutes from "./routes/auth";
import urlRoutes from "./routes/url";
import redirectRoutes from "./routes/redirect";
import { FRONT_END_BASE_URL, SERVER_PORT } from "./constants";

const startServer = (app: express.Express, PORT: number): void => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

const connectToDBAndStartServer = async (): Promise<void> => {
  try {
    // Establish the database connection
    await createConnection();

    // Create and configure the Express app
    const app = express();
    app.use(cors({ origin: FRONT_END_BASE_URL, credentials: true }));
    app.use(express.json());

    // Apply rate limiting: max 100 requests per 15 minutes per IP.
    app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

    app.use('/api/v1', authRoutes);
    app.use('/api/v1', urlRoutes);
    app.use('/', redirectRoutes);

    const PORT = Number(process.env.PORT) || SERVER_PORT;
    startServer(app, PORT);
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

connectToDBAndStartServer();
