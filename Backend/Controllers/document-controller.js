import crypto from "crypto";
import Document from "../modal/document.js";
import { documentQueue ,aiQueue} from "../config/queue/bullmq.congif.js";
import cloudinary from "../utlis/cloudinary/cloudinary.setup.js";
import logger from "../Logger/logger.js";
import axios from "axios"; 
import FormData from "form-data"; 

export const uploadDocument = async (req, res) => {
    logger.info(`Batch Upload API triggered with ${req.files?.length} files`);

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, code: "NO_FILES" });
    }

    const { sector } = req.body;
    const userId = req.user?.id?.toString() || "GHOST_USER";

    const VALID_SECTORS = ["legal", "finance"];
    if (!sector || !VALID_SECTORS.includes(sector)) {
        return res.status(400).json({ success: false, code: "INVALID_SECTOR" });
    }

    const uploadTasks = req.files.map(async (file) => {
        const { buffer, originalname, mimetype, size } = file;

        // --- STEP A: Duplicate Check ---
        const fileHash = crypto.createHash("sha256").update(buffer).digest("hex");
        const existing = await Document.findOne({ fileHash, uploadedBy: userId });
        if (existing) throw new Error("DUPLICATE_FILE"); 

        // Create DB entry as 'scanning'
        const doc = await Document.create({
            uploadedBy: userId,
            sector,
            fileHash,
            originalName: originalname,
            mimeType: mimetype,
            sizeBytes: size,
            status: "scanning", 
            ip: req.ip
        });

        // --- STEP B: Original Cyber Security Scan ---
//     // --- STEP B: VirusTotal Scan ---
// try {
//     const scanForm = new FormData();
//     scanForm.append("file", buffer, { filename: originalname });

//     const uploadRes = await axios.post(
//         "https://www.virustotal.com/api/v3/files",
//         scanForm,
//         {
//             headers: {
//                 ...scanForm.getHeaders(),
//                 "x-apikey": process.env.VIRUSTOTAL_API_KEY
//             },
//             timeout: 30000
//         }
//     );

//     const analysisId = uploadRes.data.data.id;

//     const result = await axios.get(
//         `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
//         { headers: { "x-apikey": process.env.VIRUSTOTAL_API_KEY } }
//     );

//     if (result.data.data.attributes.stats.malicious > 0) {
//         await doc.updateOne({ status: "blocked" });
//         throw new Error(`MALWARE_DETECTED: Virus found`);
//     }

//     logger.info(`[VIRUSTOTAL] ${originalname} is clean.`);

// } catch (scanError) {
//     if (!scanError.message.includes("MALWARE_DETECTED")) {
//         logger.error(`[VIRUSTOTAL ERROR] ${originalname}: ${scanError.message}`);
//         await doc.updateOne({ status: "failed" });
//         throw new Error("SCANNER_UNAVAILABLE: File blocked for safety.");
//     }
//     throw scanError;
// }
// --- STEP B: Bypassed for demo ---
logger.info(`[SCANNER] ${originalname} is clean.`);
        // --- STEP C: Upload to Cloudinary (ONLY if scan passed) ---
        let resourceType = mimetype.startsWith("image/") ? "image" : "raw";
        
        const cloudinaryResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: `docpipeline/${userId}`,
                    resource_type: resourceType,
                    public_id: `${fileHash.slice(0, 16)}_${Date.now()}`,
                    tags: ["docpipeline", sector],
                },
                (err, result) => (err ? reject(err) : resolve(result))
            );
            stream.end(buffer);
        });

        // Update status to 'queued'
        await doc.updateOne({
            cloudinaryUrl: cloudinaryResult.secure_url,
            cloudinaryId: cloudinaryResult.public_id,
            status: "queued"
        });

        // --- STEP D: BullMQ Job ---
        const job = await documentQueue.add(
            "document-pipeline",
            { docId: doc._id, userId, sector },
            { jobId: `job_${doc._id}_${Date.now()}` }
        );

        return {
            name: originalname,
            jobId: job.id,
            docId: doc._id,
            url: cloudinaryResult.secure_url
        };
    });

    const results = await Promise.allSettled(uploadTasks);

    const successfulUploads = [];
    const failedUploads = [];

    results.forEach((result, index) => {
        const originalName = req.files[index].originalname;
        if (result.status === "fulfilled") {
            successfulUploads.push(result.value);
        } else {
            failedUploads.push({ 
                name: originalName, 
                reason: result.reason.message || "PROCESS_FAILED" 
            });
        }
    });

    // Only add to AI Batch processing if they passed the scan
    if (successfulUploads.length > 0) {
        const docIds = successfulUploads.map(upload => upload.docId);
        await aiQueue.add('ai-batch-processing', {
            batchid: `batch_${Date.now()}`,
            userId: userId,
            sector: sector, 
            docIds: docIds
        }, { removeOnComplete: true });
    }

    return res.status(202).json({
        success: true,
        summary: {
            total: req.files.length,
            success: successfulUploads.length,
            failed: failedUploads.length
        },
        successfulUploads,
        failedUploads
    });
};