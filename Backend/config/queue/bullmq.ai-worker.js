import { Worker } from 'bullmq';
import redisConnection from '../Reddiis/redis.config.js';
import Document from '../../modal/document.js';
import logger from '../../Logger/logger.js';


// ai.worker.js — this is the one that sets 'done'
export const initAiWorker = () => {
    const worker = new Worker('ai-batch-processing', async (job) => {
    console.log(' AI WORKER HIT', job.data); // ← add this
    const { docIds } = job.data;
        logger.info(`AI Worker: Starting batch for ${docIds.length} files`);

        for (const id of docIds) {
            const doc = await Document.findById(id);
            if (!doc) { logger.error(`Document ${id} not found`); continue; }

            // Guard: skip if somehow already done or failed
            if (['done', 'failed', 'blocked'].includes(doc.status)) {
                logger.warn(`Skipping ${id} — already in terminal state: ${doc.status}`);
                continue;
            }

            try {
                await doc.updateOne({ status: 'analysing' });
                // const aiSummary = await startAgenticAI(doc.cloudinaryUrl, doc.sector);
                await doc.updateOne({ status: 'done', completedAt: new Date() }); // ← only here
                logger.info(`Done: ${doc.originalName}`);
            } catch (err) {
                logger.error(`Failed for ${id}: ${err.message}`);
                await doc.updateOne({ status: 'failed' });
            }
        }
    }, { connection: redisConnection });

    worker.on('completed', (job) => logger.info(`AI job ${job.id} completed`));
    worker.on('failed', (job, err) => logger.error(`AI job ${job.id} failed: ${err.message}`));
    return worker;
};