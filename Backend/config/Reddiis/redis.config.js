import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// 1. Create a configuration object that adapts to your environment
const redisOptions = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT) || 6379,
  username: process.env.REDIS_USER || "default",
  password: process.env.REDIS_PASSWORD || "",
  db: parseInt(process.env.REDIS_DB) || 0,

  maxRetriesPerRequest: null, 

  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay; // Wait longer each time, up to 2 seconds
  },

  keepAlive: 10000,   
//   // Faster startup by skipping the 'READY' check
//   enableReadyCheck: false,
  
  // If Redis is down, queue commands in RAM 
  enableOfflineQueue: true,
  connectTimeout: 15000, 
};

// 2. Initialize the connection
const redisConnection = new Redis(redisOptions);

// 3. Global Event Listener
redisConnection.on("connect", () => console.log(" Redis Connected Successfully"));
redisConnection.on("error", (err) => console.error(" Redis Error:", err));
redisConnection.on("reconnecting", () => console.warn(" Redis Reconnecting..."));

export default redisConnection;