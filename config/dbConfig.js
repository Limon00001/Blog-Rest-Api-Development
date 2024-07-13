const mongoose = require("mongoose");

// Connect to MongoDB
const dbConfig = () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("Database connected"))
    .catch((err) => console.error("Connection error:", err));
};

// Export Module
module.exports = dbConfig;
