const jwt = require('jsonwebtoken');

// Middleware to protect routes
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ message: 'No token provided!' });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // attach decoded user info to request
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token Expired!' });
    }
    return res.status(401).json({ message: 'Authentication Failed!' });
  }
};

module.exports = authenticate;
