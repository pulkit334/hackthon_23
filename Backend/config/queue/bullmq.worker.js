import { Worker } from 'bullmq';
import redisConnection from '../Reddiis/redis.config.js';
import Document from '../../modal/document.js';

;

// document.worker.js — just marks 'processed', hands off cleanly
export const initDocumentWorker = () => {
    const worker = new Worker('document-pipeline', async (job) => {
        const { docId } = job.data;
        console.log(`Processing job ${job.id} for docId ${docId}`);

        const doc = await Document.findByIdAndUpdate(
            docId,
            { status: 'processed', processedAt: new Date() }, // ← NOT 'done'
            { new: true }
        );

        if (!doc) throw new Error(`Document ${docId} not found`);
        console.log(`Job ${job.id} processed — ${doc.originalName}`);
        return { docId, status: 'processed' };

    }, { connection: redisConnection, concurrency: 10, lockDuration: 30000 });

    worker.on('completed', (job) => console.log(`Job ${job.id} finished`));
    worker.on('failed', (job, err) => console.error(`Job ${job.id} failed: ${err.message}`));
    return worker;
};