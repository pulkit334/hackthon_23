import logger from "../Logger/logger.js";
import User from "../modal/User.js";
import jwt from "jsonwebtoken"
import OtpGenrator from "otp-generator"
import OTP from "../modal/otp.js"
import bcrypt from "bcrypt"
import Profile from "../modal/Profile.js";
//otp Sent
export const otp_messanger = async (req,res)=>{
    try {
  const { email } = req.body;
      const UserExist = await User.findOne({ email });
          if (UserExist) {
      return res.status(409).json({
        success: false,
        message: "The User Already Exists",
      });
    }

     var otp = OtpGenrator.generate(6, {
    upperCaseAlphabets: true,    // ← fixed, no extra L
    lowerCaseAlphabets: false,
    specialChars:       false,
    digits:             true,
});
    const OtpPayload = {email,otp};
  // otp_messanger just saves to DB but never emails it
const OtpBody = await OTP.create(OtpPayload);
// nothing here sends email
console.log(OtpBody)
return res.status(200).json({ success: true, message: "OTP sent successfully" });
    }
    catch(error){
        logger.error("The erro while sending otp",error)
    return res.status(500).json({
  success: false,
  message: "Failed to send OTP. Please try again."
});
    }
}

//Login 
export const Login =async  (req,res)=>{
    try {
        //refresh token Later 
        const {email,Password} = req.body;
        
    if (!email || !Password) {
      return res.status(400).json({
        message: "All fields Are required",
        success: false,
      });
    }

    //checking user exist or Not 
    const user = await  User.findOne({email});
    if (!user) {
      return res.status(404).json({
        success: false,
        code: "USER_NOT_FOUND",
        message: "User does not exist",
      });
    }

    if (user.status === "Blocked") {
      return res.status(403).json({
        success: false,
        code: "Account Have Been Blocked Kindly Connect To Company",
        message: "Account Blocked",
      });
    }

   if (user.isdeleted) {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_DELETED REQUEST IS SUBMITTED",
        message: "Account is disabled",
      });
    }

    //User Password Comparrsion 
    const isPassValid = await bcrypt.compare(Password,user.password);
        if (!isPassValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
        code: "INVALID_PASSWORD",
      });
    }


    const payload = {
        email : user.email,
        id : user._id,
        accountType : user.accountType
    }
    const accessToken= jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn : "15m"
    });
    const refreshToken = jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{ expiresIn : "7d"});



    //attach Token user 
    // user.token = Token,
    user.password =  undefined

     const accessoptions = {

        httpOnly : true,
        secure: process.env.NODE_ENV==="production",
        sameSite : "lax",
        maxAge : 15 * 60 * 1000
     }
     const refreshOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

     //send cookies 
 return res
  .cookie("accessToken", accessToken, accessoptions)
  .cookie("refreshToken", refreshToken, refreshOptions)
  .json({
    success: true,
    user
  });

    }
    catch(error){
         logger.error(`Error while Login`,error)
        return res.status(500).json({
            message : "Authentication Failed",
            error : error.message,
            success : false
        })
       
    }
}
//Sinup 
                                                                                                                
export const  signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // if (
    //   !firstName ||
    //   !lastName ||
    //   !email ||
    //   !password ||
    //   !accountType ||
    //   !otp
    // ) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "All fields are required",
    //   });
    // }

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const recentOtp = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .lean();
console.log("DB OTP:", recentOtp);   // ← add this
console.log("Frontend OTP:", otp);
    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found",
      });
    }

  
   if (otp.toUpperCase() !== recentOtp.otp.toUpperCase()) {
    return res.status(400).json({
        success: false,
        message: "Invalid OTP",
    });
}

    
    const hashedPassword = await bcrypt.hash(password, 10);


    const profile = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: contactNumber ||null,
    });

    
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber: contactNumber ||null,
      password: hashedPassword,
      accountType,
      additionalDetails: profile._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
    });

    
    await OTP.deleteMany({ email });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: user._id,
    });

  } catch (error) {
    logger.error("Signup Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const logout = async (req, res) => {
  try {

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };
    await User.findByIdAndUpdate(req.user.id, {
  refreshToken: null
});

    res
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .status(200)
      .json({
        success: true,
        message: "Logged out successfully",
      });

  } catch (error) {
    logger.error(`the error would be ${error}`)
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};