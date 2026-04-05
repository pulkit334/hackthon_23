import express from "express";
import { Login, signup, otp_messanger ,logout} from "../Controllers/auth.js";
import { auth } from "../Middlewares/auth.js";

// import { auth } from "../Middlewares/auth.js";

const router = express.Router();

// Auth Routes
router.post("/otp-verification", otp_messanger);
router.post("/signup", signup);
router.post("/login", Login);
router.post("/logout",auth, logout);


// export
export default router;