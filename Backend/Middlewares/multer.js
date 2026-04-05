// routes/document.routes.js
import express from "express";
import multer from "multer";
import { uploadDocument } from "../Controllers/document-controller.js";

// ── 1. Configure Multer ───────────────────────────────────────────────────
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 15 * 1024 * 1024 // 15MB Limit
  }
});
export const multerUpload = (req, res, next) => {
 const uploadMiddleware = upload.array("files",100);
  
  uploadMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ 
          success: false, 
          code: "FILE_TOO_LARGE",
          message: "File exceeds the 15MB limit." 
        });
      }
      return res.status(400).json({ success: false, code: "UPLOAD_ERROR", message: err.message });
    } else if (err) {
      return res.status(500).json({ success: false, code: "SERVER_ERROR", message: err.message });
    }
    
    next();
  });
};
