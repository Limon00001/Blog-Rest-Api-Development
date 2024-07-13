/*
  Title: Blog API
  Description: A simple blog API
*/

// Dependencies
require("dotenv").config();
const express = require("express");
const dbConfig = require("./config/dbConfig");
const router = require("./routes/users.routes");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Database configuration
dbConfig();

// Routes
app.use("/api/users", router);

// Server listen
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
