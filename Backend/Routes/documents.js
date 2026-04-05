import express from "express";
import {uploadDocument} from "../Controllers/document-controller.js";
import { auth } from "../Middlewares/auth.js";
import { multerUpload } from "../Middlewares/multer.js";
const router = express.Router();

// Auth Routes
router.post("/document-upload",auth, multerUpload, uploadDocument);

// export
export default router;