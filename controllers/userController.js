// Dependencies
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup controller
const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (name === undefined || name === null || name === "") {
      return res.status(400).json({ error: "Name is required" });
    }
    if (email === undefined || email === null || email === "") {
      return res.status(400).json({ error: "Email is required" });
    }
    if (
      password === undefined ||
      password === null ||
      password === "" ||
      password.length < 3
    ) {
      return res
        .status(400)
        .json({ error: "Password is required and must be 3 characters long" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user document
    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    // Remove the hashed password from the response
    user.password = undefined;

    // Send the user object back to the client
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login controller
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    // If user does not exist, return an error
    if (!existingUser) return res.status(400).json({ error: "User not found" });

    // Compare the hashed password from the request with the hashed password in the database
    const isMatch = await bcrypt.compare(password, existingUser.password);

    // If passwords do not match, return an error
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    // Generate token
    const token = jwt.sign(
      {
        email: existingUser.email,
        userId: existingUser._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    // Remove the hashed password from the response
    existingUser.password = undefined;

    // Send the user object back to the client
    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// All users controller
const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Authentication Failed!" });
  }
};

// Get single user controller
const getSingleUserController = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Authentication Failed!" });
  }
};

// Update user controller
const updateUserController = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedUser = req.body;

    // Update the user
    const user = await User.findByIdAndUpdate(id, updatedUser, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Authentication Failed!" });
  }
};

// Delete user controller
const deleteUserController = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Authentication Failed!" });
  }
};

// Export module
module.exports = {
  signupController,
  loginController,
  getAllUsersController,
  getSingleUserController,
  updateUserController,
  deleteUserController,
};
