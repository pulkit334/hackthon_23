import express from "express";
import { getGlobalAnalytics } from "../Controllers/analytics.js";
import { auth } from "../Middlewares/auth.js";



const router = express.Router();
router.get('/analytics/stats',auth, getGlobalAnalytics);
// export
export default router;