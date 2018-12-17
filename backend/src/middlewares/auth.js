const prisma = require('../dataSources/Prisma');
const jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
  const { token } = req.cookies;

  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put the userId onto the req for future requests to access
    req.userId = userId;
    if (!userId) return next();

    const user = await prisma.query.user({ where: { id: userId } },
        '{id, email, name, permissions}');
    req.user = user;
  }

  next();
};