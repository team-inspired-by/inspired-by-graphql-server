const jwt = require('jsonwebtoken');
const prisma = require('../prisma'); 

module.exports = {
  generateToken: (userId) => {
    const today = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(today.getDate() + 60 * 24 * 7);
    return jwt.sign({
      id: userId,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, "mysecret");
  },
  getUser: async (request, requireAuth = true) => {
    const header = request ? request.headers.authorization : connection.context.Authorization;
    if (header) {
      const token = header.replace('Barer ', '');
      const decoded = jwt.verify(token, 'mysecret');
      const user = await prisma.query.user({
        where: {
          id: decoded.id
        }
      });
      return user;
    };

    if (requireAuth) {
      throw new Error('Authentication required');
    }
    return null;
  },
  isMemberAuthenticated: (user) => {
    if (user.level != 'MEMBER'){
      return false;
    }
    return true;
  },
  isWriterAuthenticated: (user) => {
    if (user.level != 'WRITER'){
      return false;
    } 
    return true;
  },
  isManagerAuthenticated: (user) => {
    if (user.level != 'MANAGER'){
      return false;
    }
    return true;
  },
  


};





