import { Queue } from "bullmq";
import reddisconnection from "../Reddiis/redis.config.js";

// queue.config.js — separate queue for AI so it doesn't inherit document retry logic
export const documentQueue = new Queue('document-pipeline', {
    connection: reddisconnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: { count: 100 },
        removeOnFail: { age: 24 * 3600 }
    }
});

// New: AI batch queue with NO retry — it handles its own per-doc errors internally
export const aiQueue = new Queue('ai-batch-processing', {
    connection: reddisconnection,
    defaultJobOptions: {
        attempts: 1,           // batch retries internally, not at queue level
        removeOnComplete: true,
        removeOnFail: { age: 24 * 3600 }
    }
});