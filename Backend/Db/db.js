import mongoose from "mongoose";
import logger from "../Logger/logger.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error("MongoDB Connection Failed", err);
    process.exit(1);
  }
};