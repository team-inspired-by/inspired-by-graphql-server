const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
  generateToken: (userId) => {
    const today = new Date();
    const expirationDate = new Date();
    const secret = "mysecret";
    return jwt.sign(
      { userId },
      { secret },
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
  hashPassword: (password) => {
    if (password.length < 8) {
        throw new Error('Password must be 8 characters or longer.')
    }

    return bcrypt.hash(password, 10)
  }
};



