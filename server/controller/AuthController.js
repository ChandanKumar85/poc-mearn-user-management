const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a user
const register = (req, res, next) => {
  const { name, email, phone, password } = req.body;
  User.findOne({ phone: phone }).then((existingUser) => {
    if (existingUser) {
      return res.status(400).json({
        message: 'User already registered',
      });
    }
    bcrypt.hash(password, 10, (err, hashedPass) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }
      let user = new User({
        name,
        email,
        phone,
        password: hashedPass,
      });
      user
        .save()
        .then((user) => {
          res.status(201).json({
            message: 'User registered successfully!',
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: 'An error occured!',
            error: err,
          });
        });
    });
  });
};

// To Login
const login = (req, res, next) => {
  let { username, password } = req.body;

  User.findOne({ $or: [{ email: username }, { phone: username }] }).then(
    (user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            res.json({
              error: err,
            });
          }
          if (result) {
            let token = jwt.sign({ name: user.name }, 'very(S)ecretValue', {
              expiresIn: '30s',
            });
            let refreshToken = jwt.sign(
              { name: user.name },
              'refreshTokenVery(S)ecretValue',
              {
                expiresIn: '1h',
              }
            );
            res.json({
              message: 'Login Successfull!',
              token,
              refreshToken,
            });
          } else {
            res.json({
              message: 'Password does not matched!',
            });
          }
        });
      } else {
        res.json({
          message: 'No user found',
        });
      }
    }
  );
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
      let token = jwt.sign({ name: decode.name }, 'very(S)ecretValue', {
        expiresIn: '60s',
      });
      let refreshToken = req.body.refreshToken;
      res.status(200).json({
        message: 'Token refreshed successfully!',
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
