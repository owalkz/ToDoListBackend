const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  if (!name || !email || !password) {
    res.status(422);
    throw new Error("Please fill in all fields");
  }
  if (password.length < 8) {
    res.status(422);
    throw new Error("Password length must be 8 characters or more");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  if (!newUser) {
    res.status(400);
    throw new Error("Failed to create user");
  }
  return res.status(201).json({
    message: "New User Registered Successfully",
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user._id);

    // Then send the JSON response
    res.status(200).json({
      message: "Login Successful",
      _id: user._id,
      email: user.email,
      token: token,
    });
  } else {
    res.status(422).json({ message: "Invalid credentials. Please try again." });
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = { registerUser, loginUser };
