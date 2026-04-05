import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    console.log("😐😐😐 middlware is running ")
    let token;
console.log("the header are ",req)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token missing",
      });
    }
   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
 
    let message = "Invalid token";

    if (error.name === "TokenExpiredError") {
      message = "Token expired";
    }

    return res.status(401).json({
      success: false,
      message,
    });
  }
};