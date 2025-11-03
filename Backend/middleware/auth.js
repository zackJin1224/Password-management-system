//JWT Authentication Middleware
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  //Retrieve the token from the request header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; //Bearer token

  if (!token) {
    return res.status(401).json({
      error: 'Login is required to access.',
    });
  }

  // Check token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ error: 'Token is invalid or has expired.' });
    }
    req.user = user; // Append user information to the request object
    next(); //Continue executing the next middleware or route handler
  });
};

module.exports = authenticateToken;
