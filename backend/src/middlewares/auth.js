const prisma = require('../dataSources/Prisma');
const jwt = require('jsonwebtoken');

module.exports = async function(req, res, next) {
  const { token } = req.cookies;

  if (token) {
    //TODO: handle JsonWebTokenError: invalid signature
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put the userId onto the req for future requests to access
    req.userId = userId;
    if (!userId) return next();

    const user = await prisma.query.user({ where: { id: userId } },
      '{id, email, lastName, firstName, permissions}');
    req.user = user;
  }

  next();
};