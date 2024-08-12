const jwt = require('jsonwebtoken');
const config = require('../config');

const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    req.token = token; //added now for LogResultsGrid error decoding
    console.log('Decoded user:', decoded); //logging purpose only
    next();
  } catch (e) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;