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
    } catch (e) {
      console.log(e)
    }
  }

  next()
}
