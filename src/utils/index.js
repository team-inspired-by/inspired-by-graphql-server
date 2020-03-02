const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
  
  
  hashPassword: (password) => {
    if (password.length < 8) {
        throw new Error('Password must be 8 characters or longer.')
    }

    return bcrypt.hash(password, 10)
  }
};



