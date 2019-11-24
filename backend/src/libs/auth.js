const prisma = require('../dataSources/Prisma')
const jwt = require('jsonwebtoken')

module.exports = async function (req, res, next) {
  const { token } = req.cookies

  if (token) {
    try {
      const { userId, iat, permissions } = jwt.verify(token,
        process.env.APP_SECRET)
      const expire = new Date((iat + 3600) * 1000)

      if (userId && expire > new Date()) {
        req.userId = userId
        req.permissions = permissions
      }
      // put the userId onto the req for future requests to access
      if (!userId) return next()

      // const user = await prisma.query.user({ where: { id: userId } },
      //   '{id, status, permissions}');
      //
      // req.user = user;
    } catch (e) {
      console.log(e)
    }
  }

  next()
}
