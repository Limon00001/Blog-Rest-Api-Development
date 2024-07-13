// Dependencies
const express = require("express");
const {
  signupController,
  loginController,
  getAllUsersController,
  getSingleUserController,
  updateUserController,
  deleteUserController,
} = require("../controllers/userController");
const checkAuthentication = require("../middlewares/authentication");

// Router instance
const router = express.Router();

// Router configuration
router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/", checkAuthentication, getAllUsersController);
router.get("/:id", checkAuthentication, getSingleUserController);
router.put("/:id", checkAuthentication, updateUserController);
router.delete("/:id", checkAuthentication, deleteUserController);

// Export Module
module.exports = router;
