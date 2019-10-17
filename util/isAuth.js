const jwt = require('jsonwebtoken');
const config = require('../util/config');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('No Header authenticated.');
    error.statusCode = 401
    throw error;
  }

  let decodedToken;
  try {
    const token = authHeader.split(' ')[1];
    decodedToken = jwt.verify(token, config.jwt.secret_key);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401
    throw error;
  }
  
  req.user_id = decodedToken.user_id;
  req.role_id = decodedToken.role_id;
  next(); 
};