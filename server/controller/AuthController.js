const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

function generateRandomId(length = 10) {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
}

// Register a user
const register = async (req, res, next) => {
  try {
    const { userName, emailId, phoneNumber, password, confirmPassword } = req.body;

    console.log(password, confirmPassword);

    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({
        message: 'USER_ALREADY_EXISTS', // User already registered
      });
    }

    const bytesPassword = CryptoJS.AES.decrypt(password, process.env.AES_SECRET_KEY);
    const originalPassword = bytesPassword.toString(CryptoJS.enc.Utf8);

    const bytesConfirmPassword = CryptoJS.AES.decrypt(confirmPassword, process.env.AES_SECRET_KEY);
    const originalConfirmPassword = bytesConfirmPassword.toString(CryptoJS.enc.Utf8);

    if (!originalPassword || !originalConfirmPassword) {
      return res.status(400).json({ message: 'INVALID_ENCRYPTED_DATA' });
    }

    // Check confirm password match
    if (originalPassword !== originalConfirmPassword) {
      return res.status(400).json({
        message: 'PASSWORD_MISMATCH', // Passwords do not match
      });
    }

    // Create new user
    const newUser = new User({
      userName,
      emailId,
      phoneNumber,
      password: originalPassword,
      confirmPassword: originalConfirmPassword,
      role: 'user',
    });

    await newUser.save();

    return res.status(201).json({
      message: 'USER_REGISTERED', // User registered successfully!
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'AN_ERROR_OCCURRED', // An error occurred
      error: err.message,
    });
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    // Check user by email or phone
    const user = await User.findOne({
      $or: [{ emailId: userName }, { phoneNumber: userName }],
    });

    if (!user) {
      return res.status(404).json({
        message: 'NO_USER_FOUND', // No user found
      });
    }

    const bytesPassword = CryptoJS.AES.decrypt(password, process.env.AES_SECRET_KEY);
    const originalPassword = bytesPassword.toString(CryptoJS.enc.Utf8);

    // Compare password
    const isMatch = await bcrypt.compare(originalPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'INVALID_CREDENTIAL', // Invalid credentials
      });
    }

    // 🚀 Block if already logged in (active session exists)
    if (user.activeId) {
      return res.status(409).json({
        message: 'ALREADY_LOGGED_IN_ON_ANOTHER_DEVICE',
      });
    }

    const randomActiveId = generateRandomId();

    // Generate JWT token
    const token = jwt.sign({ activeId: randomActiveId, userName: user.userName, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
    });

    // store latest token in DB
    await User.findByIdAndUpdate(user._id, { activeId: randomActiveId });

    // Optionally create refresh token
    // const refreshToken = jwt.sign(
    //   { userName: user.userName },
    //   "refreshTokenVery(S)ecretValue",
    //   { expiresIn: "1h" }
    // );

    return res.json({
      message: 'LOGIN_SUCCESSFUL',
      token,
      // refreshToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'SERVER_ERROR',
      error: error.message,
    });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const { activeId } = req.body;

    const user = await User.findOne({ activeId });
    if (!user) {
      return res.status(400).json({ message: 'INVALID_ACTIVE_ID' });
    }

    // Clear activeId in DB
    await User.findByIdAndUpdate(user._id, { activeId: null });

    return res.json({ message: 'LOGOUT_SUCCESSFUL' });
  } catch (err) {
    return res.status(500).json({ message: 'SERVER_ERROR', error: err.message });
  }
};

// Check Session
const checkSession = async (req, res) => {
  const { activeId } = req.body;

  const user = await User.findOne({ activeId });
  if (!user) {
    return res.json({ valid: false });
  }

  return res.json({ valid: true });
};

module.exports = {
  register,
  login,
  logout,
  checkSession,
  // refreshToken,
};
