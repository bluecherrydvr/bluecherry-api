import {DataTypes, Model} from 'sequelize';
import {Server} from '../../server';

class Media extends Model {}

function Register(): void {
  Media.init(
    {
      archive: DataTypes.BOOLEAN,
      device_id: DataTypes.INTEGER,
      end: DataTypes.INTEGER,
      filepath: DataTypes.STRING,
      id: {primaryKey: true, type: DataTypes.INTEGER},
      size: DataTypes.BIGINT,
      start: DataTypes.INTEGER,
    },
    {sequelize: Server.sequelize, modelName: 'Media'}
  );
}

export {Media};
export default {Media, Register};
