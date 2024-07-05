import {DataTypes, Model} from 'sequelize';
import {Server} from '../../server';

class Events extends Model {}

function Register(): void {
    Events.init(
    {
        id: {primaryKey: true, type: DataTypes.INTEGER},
        time: DataTypes.INTEGER,
        level_id: DataTypes.STRING,
        device_id: DataTypes.INTEGER,
        type_id: DataTypes.STRING,
        length: DataTypes.INTEGER,
        archive: DataTypes.BOOLEAN,
        media_id: DataTypes.INTEGER,
        details: DataTypes.TEXT
    }, {sequelize: Server.sequelize, tableName: 'EventsCam', modelName: 'Events'})
}

export {Events};
export default {Events, Register};