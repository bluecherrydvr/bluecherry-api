const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const ActiveUsers = require('../models/ActiveUsers');

const secret = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'secret';

const authService = () => {
  const issue = (payload) => {
    const token = jwt.sign(payload, secret, { expiresIn: 10800 });

    ActiveUsers.create({
      userId: payload.id,
      time: new Date().getTime(),
      token,
      from_client: payload.clientIp,
    });
    return token;
  };

  const hasToken = async (token) => {
    try {
      let data = await ActiveUsers.findOne({
        where: {
          token,
        },
      });
      data = data.toJSON();
      return data && data.userId;
    } catch (e) {
      return false;
    }
  };

  const verify = async (token, cb) => {
    const Token = await hasToken(token);
    if (!Token) {
      return jwt.verify('dummyTokenForInvalidate', secret, {}, cb);
    }
    return jwt.verify(token, secret, {}, cb);
  };

  const kick = async (token) => {
    try {
      await ActiveUsers.destroy({
        where: {
          token,
          kick: {
            [Sequelize.Op.not]: true,
          },
        },
      });
      return true;
    } catch (e) {
      return false;
    }
  };

  return {
    issue,
    verify,
    kick,
    hasToken,
  };
};

module.exports = authService();
