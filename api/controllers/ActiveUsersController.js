const ActiveUsers = require('../models/ActiveUsers');

const ActiveUsersController = () => {
  const getAll = async (req, res) => {
    try {
      const users = await ActiveUsers.findAll();

      return res.status(200).json({ users });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };


  return {
    getAll,
  };
};

module.exports = ActiveUsersController;
