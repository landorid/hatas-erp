const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { AuthenticationError, UserInputError } = require('apollo-server')
const { forwardTo } = require('prisma-binding')
const { hasPermission, authHelper } = require('../utils')

const mutations = {
  updateUser: forwardTo('prisma'),
  createStockItem: forwardTo('prisma'),
  createStockCategory: forwardTo('prisma'),
  upsertStockCategory: forwardTo('prisma'),
  deleteManyStockCategories: forwardTo('prisma'),
  upsertStockItem: forwardTo('prisma'),
  upsertSupplier: forwardTo('prisma'),
  upsertProductTemplate: forwardTo('prisma'),
  upsertProductField: forwardTo('prisma'),
  upsertWorksheet: forwardTo('prisma'),
  async signIn (parent, { email, password }, { res, prisma }, info) {
    //1.check if there si a user with that email
    const user = await prisma.query.user({ where: { email } }, '{id, permissions, status, password}')
    if (!user.id) {
      throw new UserInputError('Form Arguments invalid', {
        invalidArgs: {
          'email': 'Nincs ilyen felhasználó!',
        },
      })
    }
    if (!user.status) {
      throw new UserInputError('Form Arguments invalid', {
        invalidArgs: {
          'email': 'Archivált felhasználó!',
        },
      })
    }
    //2.check if their passowrd is correct
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new UserInputError('Form Arguments invalid', {
        invalidArgs: {
          'password': 'Helytelen jelszó!',
        },
      })
    }
    //3.generate jwt token
    const token = jwt.sign({
        userId: user.id,
        permissions: user.permissions,
      },
      process.env.APP_SECRET)
    //4. set the cookie with the token
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600 * 1000,
    })
    //5.returnk user
    return user
  },

  async signOut (parent, args, { res }, info) {
    res.clearCookie('token')
    return { message: 'Success Logout!' }
  },

  async signUp (parent, { data }, { req, prisma }, info) {
    authHelper(req)
    hasPermission(req.user, ['ADMIN'])

    const user = await prisma.query.user({ where: { email: data.email } })
    if (user) {
      throw new UserInputError('Form Arguments invalid', {
        invalidArgs: {
          'email': 'Ezzel az email címmel már regisztráltak!',
        },
      })
    }

    data.password = await bcrypt.hash(data.password, 10)

    return prisma.mutation.createUser({ data }, info)
  },

  async updateProfile (parent, args, { res, req, prisma }, info) {
    authHelper(req)

    const user = await prisma.query.users(
      { where: { email: args.email, id_not: req.userId } })
    if (user && user.length) {
      throw new UserInputError('Form Arguments invalid', {
        invalidArgs: {
          'email': 'Ezzel az email címmel már regisztráltak!',
        },
      })
    }

    return prisma.mutation.updateUser({
      where: {
        id: req.userId,
      },
      data: {
        ...args,
        job: {
          set: args.job,
        },
      },
    }, info)
  },

  async changePassword (
    parent, { oldPassword, newPassword }, { res, req, prisma }, info) {
    authHelper(req)

    const user = await prisma.query.user({
      where: { id: req.userId },
    })

    const valid = await bcrypt.compare(oldPassword, user.password)
    if (!valid) {
      throw new UserInputError('Form Arguments invalid', {
        invalidArgs: {
          'oldPassword': 'Helytelen jelszó!',
        },
      })
    }
    const secureNewPassword = await bcrypt.hash(newPassword, 10)

    return prisma.mutation.updateUser({
      where: { id: req.userId },
      data: {
        password: secureNewPassword,
      },
    }, info)
  },

  async changeAvatar (parent, { image }, { req, prisma }, info) {
    authHelper(req)

    return prisma.mutation.updateUser({
      where: { id: req.userId },
      data: {
        avatar: image,
      },
    }, info)
  },

  async createCustomer (parent, args, { req, prisma }, info) {
    authHelper(req)

    return prisma.mutation.createCustomer(args, info)
  },

  async updateCustomer (parent, args, { req, prisma }, info) {
    authHelper(req)

    return prisma.mutation.updateCustomer(args, info)
  },

  async upsertProductTemplateItem (parent, args, { req, prisma }, info) {
    const fieldsToUpsert = args.data.fields.reduce((array, item) => {
      const id = item.id || -1
      delete item.id

      array.push({
        where: { id },
        update: item,
        create: item,
      })
      return array
    }, [])

    const productTemplate = {
      where: {
        id: args.data.id || -1,
      },
      create: {
        name: args.data.name,
        owner: {
          connect: {
            id: req.userId,
          },
        },
        status: args.data.status,
        fields: {
          create: args.data.fields,
        },
      },
      update: {
        name: args.data.name,
        status: args.data.status,
        fields: {
          upsert: fieldsToUpsert,
          //TODO: if you want to delete field which is used before, app will crash
          delete: args.data.delete,
        },
      },
    }

    return prisma.mutation.upsertProductTemplate(productTemplate, info)
  },
}
module.exports = mutations
