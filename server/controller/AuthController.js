const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a user
const register = (req, res, next) => {
  const { userName, emailId, phoneNumber, password } = req.body;
  User.findOne({ phoneNumber: phoneNumber }).then((existingUser) => {
    if (existingUser) {
      return res.status(400).json({
        message: 'USER_ALREADY_EXISTS', // User already registered
      });
    }
    bcrypt.hash(password, 10, (err, hashedPass) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }
      let user = new User({
        userName,
        emailId,
        phoneNumber,
        password: hashedPass,
      });
      user
        .save()
        .then((user) => {
          res.status(201).json({
            message: 'USER_REGISTERED', // User registered successfully!
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: 'AN_ERROR_OCCURRED', // An error occured!
            error: err,
          });
        });
    });
  });
};

// To Login
const login = (req, res, next) => {
  let { userName, password } = req.body;

  User.findOne({
    $or: [{ emailId: userName }, { phoneNumber: userName }],
  }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          res.json({
            error: err,
          });
        }
        if (result) {
          let token = jwt.sign(
            { userName: user.userName },
            'very(S)ecretValue',
            {
              expiresIn: '30m',
            }
          );
          let refreshToken = jwt.sign(
            { userName: user.userName },
            'refreshTokenVery(S)ecretValue',
            {
              expiresIn: '1h',
            }
          );
          res.json({
            message: 'LOGIN_SUCCESSFUL', // Login Successfull!
            token,
            refreshToken,
          });
        } else {
          res.status(404).json({
            message: 'INVALID_CREDENTIAL', // Invalid credentials
          });
        }
      });
    } else {
      res.json({
        message: 'NO_USER_FOUND', // No user found
      });
    }
  });
};

const refreshToken = (req, res, next) => {
  console.log(process.env.ACCESS_TOKEN_SECRET);
  const refreshToken = req.body.refreshToken;
  jwt.verify(refreshToken, 'refreshTokenVery(S)ecretValue', (err, decode) => {
    if (err) {
      res.status(400).json({
        err,
      });
    } else {
      let token = jwt.sign({ userName: decode.userName }, 'very(S)ecretValue', {
        expiresIn: '60s',
      });
      let refreshToken = req.body.refreshToken;
      res.status(200).json({
        message: 'REFRESHED_TOKEN', // Token refreshed successfully!
        token,
        refreshToken,
      });
    }
  });
};

module.exports = {
  register,
  login,
  refreshToken,
};
