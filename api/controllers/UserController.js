const User = require('../models/User');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');
// const CameraService = require('../services/camera.service');

const UserController = () => {
  const register = async (req, res) => {
    const { body } = req;

    if (body.password === body.password2) {
      try {
        const user = await User.create({
          email: body.email,
          password: body.password,
        });
        const token = authService.issue({ id: user.id });

        return res.status(200).json({ token, user });
      } catch (err) {
        return res.status(500).json({ msg: 'Internal server error', err });
      }
    }

    return res.status(400).json({ msg: 'Bad Request: Passwords don\'t match' });
  };

  const login = async (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
      try {
        const user = await User
          .findOne({
            where: {
              username,
            },
          });

        if (!user) {
          return res.status(400).json({ msg: 'Bad Request: User not found' });
        }

        if (bcryptService().comparePassword(`${password}${process.env.SALT}`, user.password)) {
          const token = authService.issue({
            id: user.id,
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
          });

          return res.status(200).json({ token, user });
        }

        return res.status(401).json({ msg: 'Unauthorized' });
      } catch (err) {
        return res.status(500).json({ msg: 'Internal server error', err });
      }
    }

    return res.status(400).json({ msg: 'Bad Request: Email or password is wrong' });
  };

  const validate = (req, res) => {
    const { token } = req.body;

    authService.verify(token, (err) => {
      if (err) {
        return res.status(401).json({ isvalid: false, err: 'Invalid Token!' });
      }

      return res.status(200).json({ isvalid: true });
    });
  };

  const getAll = async (req, res) => {
    try {
      const users = await User.findAll();

      return res.status(200).json({ users });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  const getUserById = async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (user) {
        return res.status(200).json({ user });
      }
      return res.status(404).json({ msg: 'user not found' });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  const updateUserById = async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (user) {
        let keys = Object.keys(req.body);
        keys = keys.filter((key) => key !== 'salt');

        // eslint-disable-next-line no-restricted-syntax
        for (const key of keys) {
          if (key === 'email' && Array.isArray(req.body[key])) {
            user[key] = req.body[key].join('|');
          } else {
            user[key] = req.body[key];
          }
          user.access_web = req.body.access_web === 'on' ? 1 : 0;
          user.access_remote = req.body.access_remote === 'on' ? 1 : 0;
          user.access_backup = req.body.access_backup === 'on' ? 1 : 0;
          user.access_setup = req.body.access_setup === 'on' ? 1 : 0;
        }
        await user.save();
        return res.status(200).json({ user });
      }
      return res.status(404).json({ msg: 'user not found' });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  const getCameraPermission = async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (user) {
        const { cams } = req.body;

        // eslint-disable-next-line no-restricted-syntax
        if (cams && Array.isArray(cams)) {
          user.access_device_list = cams.join(',');
          await user.save();
        }
        return res.status(200).json({ user });
      }
      return res.status(404).json({ msg: 'user not found' });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  const kickUser = async (req, res) => {
    try {
      // const handler = new CameraService({ test: 'one' });
      // console.log(handler.getProject('test'));

      if (!req.body.token) {
        return res.status(404).json({ msg: 'token not found' });
      }
      const parts = req.header('Authorization').split(' ');

      if (parts.length < 2) {
        return res.status(404).json({ msg: 'token not found' });
      }

      if (parts[1] === req.body.token) {
        return res.status(404).json({ msg: 'You can not kick out youself' });
      }
      await authService.kick(req.body.token);
      return res.status(200).json({ msg: 'user kicked out' });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  return {
    register,
    login,
    validate,
    getAll,
    getUserById,
    updateUserById,
    getCameraPermission,
    kickUser,
  };
};

module.exports = UserController;
