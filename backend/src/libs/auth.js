const prisma = require('../dataSources/Prisma');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');

module.exports = async function(req, res, next) {
  const { token } = req.cookies;

  if (token) {
    try {
      const { userId } = jwt.verify(token, process.env.APP_SECRET);
      if (userId)
        req.userID = userId;

      // put the userId onto the req for future requests to access
      if (!userId) return next();
      req.userId = userId;

      // const user = await prisma.query.user({ where: { id: userId } },
      //   '{id, email, lastName, firstName, status, permissions}');
      //
      // req.user = user;
    } catch (e) {
      console.log(e);
    }

    // if(!req.user.status) {
    //   res.clearCookie('token');
    // }
  }

  next();
};