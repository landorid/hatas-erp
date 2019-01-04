const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AuthenticationError, UserInputError } = require('apollo-server');
const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const mutations = {
  updateUser: forwardTo('prisma'),
  async signIn(parent, { email, password }, { res, prisma }, info) {
    //1.check if there si a user with that email
    const user = await prisma.query.user({ where: { email } });
    if (!user) {
      throw new UserInputError('Form Arguments invalid', {
        invalidArgs: {
          'email': 'Nincs ilyen felhasználó!',
        },
      });
    }
    if(!user.status) {
      throw new UserInputError('Form Arguments invalid', {
        invalidArgs: {
          'email': 'Archivált felhasználó!',
        },
      });
    }
    //2.check if their passowrd is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UserInputError('Form Arguments invalid', {
        invalidArgs: {
          'password': 'Helytelen jelszó!',
        },
      });
    }
    //3.generate jwt token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    //4. set the cookie with the toekn
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    //5.returnk user
    return user;
  },

  async signOut(parent, args, { res }, info) {
    res.clearCookie('token');
    return { message: 'Success Logout!' };
  },

  async signUp(parent, { data }, { req, prisma }, info) {
    if (!req.userId) {
      throw new AuthenticationError('Jelentkezz be!');
    }

    hasPermission(req.user, ['sADMIN']);

    const user = await prisma.query.user({ where: { email: data.email } });
    if (user) {
      throw new UserInputError('Form Arguments invalid', {
        invalidArgs: {
          'email': 'Ezzel az email címmel már regisztráltak!',
        },
      });
    }

    data.password = await bcrypt.hash(data.password, 10);

    return prisma.mutation.createUser({ data }, info);
  },

  async updateProfile(parent, args, { res, req, prisma }, info) {
    if (!req.userId) {
      throw new AuthenticationError('Jelentkezz be!');
    }

    const user = await prisma.query.users({ where: { email: args.email, id_not: req.userId } });
    if (user && user.length) {
      throw new UserInputError('Form Arguments invalid', {
        invalidArgs: {
          'email': 'Ezzel az email címmel már regisztráltak!',
        },
      });
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
    }, info);
  },

  async changePassword(parent, { oldPassword, newPassword }, { res, req, prisma }, info) {
    if (!req.userId) {
      throw new AuthenticationError('Jelentkezz be!');
    }

    const user = await prisma.query.user({
      where: { id: req.userId },
    });

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      throw new UserInputError('Form Arguments invalid', {
        invalidArgs: {
          'oldPassword': 'Helytelen jelszó!',
        },
      });
    }
    const secureNewPassword = await bcrypt.hash(newPassword, 10);

    return prisma.mutation.updateUser({
      where: { id: req.userId },
      data: {
        password: secureNewPassword,
      },
    }, info);
  },

  async changeAvatar(parent, { image }, { req, prisma }, info) {
    if (!req.userId) {
      throw new AuthenticationError('Jelentkezz be!');
    }

    return prisma.mutation.updateUser({
      where: { id: req.userId },
      data: {
        avatar: image,
      },
    }, info);
  },
};
module.exports = mutations;