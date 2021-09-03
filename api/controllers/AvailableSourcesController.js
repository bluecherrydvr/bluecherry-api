const AvailableSources = require('../models/AvailableSources');

const AvailableSourcesController = () => {
  const getAll = async (req, res) => {
    try {
      const users = await AvailableSources.findAll();

      return res.status(200).json({ users });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };


  return {
    getAll,
  };
};

module.exports = AvailableSourcesController;
