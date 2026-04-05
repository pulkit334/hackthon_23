import mongoose from "mongoose";
import mailSender from "../Otp-Senders/mailsender.js";
import  otpTemplate  from "../utlis/templates/mail.js";

const otpSchema = new mongoose.Schema({
  otp: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: true, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60, 
  },
});


async function sendVerification(email, otp) {
  try {
    await mailSender(
      email,
      "OTP Verification",
      otpTemplate(otp)
    );
  } catch (err) {
    console.error("OTP Mail Error:", err);
    throw new Error("Failed to send OTP");
  }
}


otpSchema.pre("save", async function (next) {
  if (!this.isNew) return next();
  try {
    await sendVerification(this.email, this.otp);
  } catch (err) {
    next(err); //  don’t swallow error
  }
});

//retry logic later 

export default mongoose.model("OTP", otpSchema);