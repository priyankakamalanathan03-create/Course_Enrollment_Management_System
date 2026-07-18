const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Utility function to generate a JWT token for authentication
 * @param {string} id - The MongoDB Object ID of the user
 * @param {string} role - The user's role (e.g., 'student', 'instructor', 'admin')
 * @returns {string} Signed JWT Token valid for 30 days
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "30d",
  });
};

/**
 * @desc    Register a new user in the system
 * @route   POST /api/auth/register
 * @access  Public
 * @param   {Object} req.body - Contains name, email, password, and optionally role
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate Password Strength
    if (!password || password.length < 6) {
      res.status(400);
      throw new Error("Password is too weak. It must be at least 6 characters long.");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error("User with this email already exists");
    }

    const normalizedRole = ["student", "instructor", "admin"].includes(role)
      ? role
      : "student";

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: normalizedRole,
    });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate a user and return a JWT token
 * @route   POST /api/auth/login
 * @access  Public
 * @param   {Object} req.body - Contains email and password
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get the profile of the currently logged-in user
 * @route   GET /api/auth/me
 * @access  Private (Requires valid JWT)
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};
