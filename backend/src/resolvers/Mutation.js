const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mutations = {
  async signIn(parent, { email, password }, { res, prisma }, info) {
    //1.check if there si a user with that email
    const user = await prisma.query.user({ where: { email } });
    if (!user) {
      throw new Error(`NO_USER_FOUND`);
    }
    //2.check if their passowrd is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error(`INVALID_PASSWORD`);
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

  async updateProfile(parent, args, { res, req, prisma }, info) {
    if (!req.userId) {
      throw new Error('Jelentkezz be!');
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
      throw new Error('Jelentkezz be!');
    }

    const user = await prisma.query.user({
      where: { id: req.userId },
    });

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      throw new Error(`INVALID_OLD_PASSWORD`);
    }
    const secureNewPassword = await bcrypt.hash(newPassword, 10);

    return prisma.mutation.updateUser({
      where: { id: req.userId },
      data: {
        password: secureNewPassword,
      },
    }, info);
  },
};
module.exports = mutations;