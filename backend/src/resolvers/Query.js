const { forwardTo } = require('prisma-binding');

const queries = {
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