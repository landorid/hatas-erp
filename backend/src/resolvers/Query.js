const { authHelper } = require('../utils');
const { forwardTo } = require('prisma-binding');

const queries = {
  // stockItems: forwardTo('prisma'),
  stockCategories: forwardTo('prisma'),
  stockItem: forwardTo('prisma'),
  stockItems: forwardTo('prisma'),
  supplier: forwardTo('prisma'),
  suppliers: forwardTo('prisma'),
  productTemplate: forwardTo('prisma'),
  productTemplates: forwardTo('prisma'),
  tags: forwardTo('prisma'),
  users: forwardTo('prisma'),
  worksheets: forwardTo('prisma'),
  worksheet: forwardTo('prisma'),

  async customers(parent, args, { req, prisma }, info) {
    authHelper(req);

    return await prisma.query.customers(args, info);
  },
  async customer(parent, args, { req, prisma }, info) {
    authHelper(req);

    return await prisma.query.customer(args, info);
  },
  async user(parent, args, { req, prisma }, info) {
    authHelper(req);

    return await prisma.query.user(args, info);
  },
  async me(parent, args, { req, prisma }, info) {
    if (!req.userId) {
      return null;
    }

    return await prisma.query.user({ where: { id: req.userId }, }, info);
  },
};

module.exports = queries;
