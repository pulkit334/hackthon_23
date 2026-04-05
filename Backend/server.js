  import cluster from "cluster";
  import os from "os";
  import express from "express";
  // import helmet from "helmet"; //  Helmet completely removed for testing
  import cors from "cors";
  import cookieParser from "cookie-parser";
  import { createServer } from "http";
  import morgan from "morgan";
  import dotenv from "dotenv";
  import rateLimit from "express-rate-limit";
  import { availableParallelism } from "node:os";

  const numCPUs = availableParallelism();

  //Local-Imports-------------------
  import logger from "./Logger/logger.js";
  import { connectDB } from "./Db/db.js";
  import authRoutes from "./Routes/auth.js";
  import documentRoutes from "./Routes/documents.js";
  import AnalyticsRoutes from "./Routes/analytics.js"
  import { initDocumentWorker } from "./config/queue/bullmq.worker.js";
  import { initAiWorker } from "./config/queue/bullmq.ai-worker.js";
  dotenv.config();

  process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION! Shutting down...");
    console.error(err);
    process.exit(1);
  });

  process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION! Shutting down...");
    console.error(err);
    process.exit(1);
  });

  if (cluster.isPrimary) {
    console.log(`Master ${process.pid} running`);

    // Connect DB and start queue workers ONCE on primary
    await connectDB();
    initDocumentWorker();
    initAiWorker();

    const workers = numCPUs - 2;
    for (let i = 0; i < workers; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker) => {
      console.log(`Worker ${worker.process.pid} died. Restarting...`);
      cluster.fork();
    });

  } else {
    const app = express();

    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "http://localhost:5173");
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
      res.header("Access-Control-Allow-Credentials", "true");
      if (req.method === "OPTIONS") return res.status(200).end();
      next();
    });

    app.use(cors({
      origin: "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
    }));

    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    app.use(cookieParser());
    app.use(morgan("dev"));

    app.use("/api/auth", authRoutes);
    app.use("/api/v2", documentRoutes);
    app.use("/api/v3", AnalyticsRoutes);

    app.get("/", (req, res) => {
      logger.info("Health check hit");
      res.status(200).json({ success: true, message: `Backend running on worker ${process.pid}` });
    });

    app.get("/api/test", (req, res) => {
      res.json({ message: `Handled by worker ${process.pid}` });
    });

    app.use((req, res) => {
      res.status(404).json({ success: false, message: "Route not found" });
    });

    app.use((err, req, res, next) => {
      logger.error(err.message);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    });

    const PORT = process.env.PORT || 4000;
    const server = createServer(app);

    server.listen(PORT, async () => {
      try {
        await connectDB();
        logger.info(`Server started on PORT ${PORT} — worker ${process.pid}`);
      } catch (error) {
        logger.error("Failed to connect DB", error);
      }
    });
  }
