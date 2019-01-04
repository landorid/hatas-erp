const { forwardTo } = require('prisma-binding');

const queries = {
  user: forwardTo('prisma'),
  async users(parent, args, { req, prisma }, info) {
    if (!req.userId) {
      throw new Error('Unauthenticated!')
    }

    return await prisma.query.users(args, info);
  },
  async me(parent, args, { req, prisma }, info) {
    //check if there is a current user
    if (!req.userId) {
      return null;
    }

    return await prisma.query.user({
      where: { id: req.userId },
    }, info);
  },

};

module.exports = queries;