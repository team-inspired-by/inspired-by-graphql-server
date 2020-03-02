const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
  generateToken: (userId) => {
    const today = new Date();
    const expirationDate = new Date();
    const secret = "mysecret";
    return jwt.sign(
      { userId },
      secret,
      { expiresIn: '7d' }
    )
  },
  getUserId: (request, requireAuth = true) => {
    const header = request.request ? request.request.headers.authorization : request.connection.context.Authorization;
    
    if (header) {
      const token = header.replace('Barer ', '');
      const decoded = jwt.verify(token, 'mysecret');
      return decoded.userId
    }

    if (requireAuth) {
      throw new Error('Authentication required');
    }
    return null;
  },

};





