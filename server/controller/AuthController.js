const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

// =======================
// Utility: Generate Random Active Session ID
// =======================
function generateRandomId(length = 10) {
  return Math.random().toString(36).substring(2, length + 2);
}

// =======================
// Register User
// =======================
const register = async (req, res) => {
  try {
    const { userName, emailId, phoneNumber, password, confirmPassword } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'USER_ALREADY_EXISTS' });
    }

    // Decrypt password
    const originalPassword = CryptoJS.AES.decrypt(password, process.env.AES_SECRET_KEY).toString(CryptoJS.enc.Utf8);
    const originalConfirmPassword = CryptoJS.AES.decrypt(confirmPassword, process.env.AES_SECRET_KEY).toString(CryptoJS.enc.Utf8);

    if (!originalPassword || !originalConfirmPassword) {
      return res.status(400).json({ message: 'INVALID_ENCRYPTED_DATA' });
    }

    if (originalPassword !== originalConfirmPassword) {
      return res.status(400).json({ message: 'PASSWORD_MISMATCH' });
    }

    // Save new user
    const newUser = new User({
      userName,
      emailId,
      phoneNumber,
      password: originalPassword,
      confirmPassword: originalConfirmPassword,
    });

    await newUser.save();
    return res.status(201).json({ message: 'USER_REGISTERED' });
  } catch (err) {
    return res.status(500).json({ message: 'SERVER_ERROR', error: err.message });
  }
};

// =======================
// Login User
// =======================
const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ emailId: userName }, { phoneNumber: userName }],
    });
    if (!user) return res.status(404).json({ message: 'NO_USER_FOUND' });

    // Decrypt password & compare
    const originalPassword = CryptoJS.AES.decrypt(password, process.env.AES_SECRET_KEY).toString(CryptoJS.enc.Utf8);
    const isMatch = await bcrypt.compare(originalPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'INVALID_CREDENTIAL' });

    // Block multiple logins
    if (user.activeId) {
      return res.status(409).json({ message: 'ALREADY_LOGGED_IN_ON_ANOTHER_DEVICE' });
    }

    const randomActiveId = generateRandomId();

    // Generate JWT
    const token = jwt.sign(
      { activeId: randomActiveId, userName: user.userName, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME }
    );

    // Save active session in DB
    await User.findByIdAndUpdate(user._id, { activeId: randomActiveId });

    return res.json({ message: 'LOGIN_SUCCESSFUL', token });
  } catch (error) {
    return res.status(500).json({ message: 'SERVER_ERROR', error: error.message });
  }
};

// =======================
// Logout User
// =======================
const logout = async (req, res) => {
  try {
    const { activeId } = req.body;
    const user = await User.findOne({ activeId });
    if (!user) return res.status(400).json({ message: 'INVALID_ACTIVE_ID' });

    await User.findByIdAndUpdate(user._id, { activeId: null });
    return res.json({ message: 'LOGOUT_SUCCESSFUL' });
  } catch (err) {
    return res.status(500).json({ message: 'SERVER_ERROR', error: err.message });
  }
};

// =======================
// Check Active Session
// =======================
const checkSession = async (req, res) => {
  const { activeId } = req.body;
  const user = await User.findOne({ activeId });
  return res.json({ valid: !!user });
};

module.exports = { register, login, logout, checkSession };
