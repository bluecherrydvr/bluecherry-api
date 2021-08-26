const { QueryTypes } = require('sequelize');
const sequelize = require('../../config/database');

module.exports = class Cards {

  constructor(id) {
    return (async () => {
      const data = await sequelize.query(`SELECT device FROM AvailableSources WHERE card_id=${id}`, { type: QueryTypes.SELECT });
      this.info = {
        id,
        encoding: 'notconfigured',
      };
      this.cameras = author;

      return this; // when done
    })();
  }
};
