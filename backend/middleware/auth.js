// Protects routes that require login

const jwt = require("jsonwebtoken");
const user = require("../models/user");

// This function checks if user is logged in
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in cookies (most secure)
  if (req.cookies.token) {
    token = req.cookies.token;
  }
  // Or check Authorization header (alternative)
  else if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, please login.",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request object (without password)
    req.user = await user.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token. Please login again.",
    });
  }
};

// This function checks if user is admin
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "admin access required",
    });
  }
};
