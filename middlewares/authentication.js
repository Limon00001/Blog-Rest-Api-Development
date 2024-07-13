// Dependencies
const jwt = require("jsonwebtoken");

// Authentication
const checkAuthentication = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const { email, userId } = decoded;
    req.email = email;
    req.userId = userId;

    next();
  } catch (error) {
    // next("Authentication failed!");
    res.status(401).json({ error: "Authentication failed" });
  }
};

// Export module
module.exports = checkAuthentication;
