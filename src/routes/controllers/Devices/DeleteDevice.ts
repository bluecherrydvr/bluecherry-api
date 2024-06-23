import {Request, Response, NextFunction} from 'express';
import ErrorResponse from '../../../models/api/Responses/ErrorResponse';
import {Devices} from '../../../models/db/Device';
import {Server} from '../../../server';

export async function deleteDevice(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let deviceId = req.params.deviceId ?? -1;

  Devices.findOne({where: {id: deviceId}})
    .then(device => {
      let id = device.dataValues.id || -1;
      if (id == -1) {
        res
          .status(404)
          .send(
            new ErrorResponse(
              404,
              `A device with the ID ${deviceId} was not found!`
            )
          );
        return;
      }
      try {
        Server.sequelize.query(`DELETE FROM EventsCam WHERE device_id='${id}'`);
        Server.sequelize.query(
          `DELETE FROM OnvifEvents WHERE device_id='${id}'`
        );
        Server.sequelize
          .query(
            `SELECT id, filepath FROM Media WHERE device_id='${id}' ORDER BY id DESC`
          )
          .then((result: [any, any]) => {
            if (result[0].length > 0) {
              let highestId = result;
              Server.sequelize.query(
                `DELETE FROM Media WHERE device_id='${id}' AND id <= ${highestId}`
              );
            }
          });
        device.destroy();
        res
          .status(200)
          .send(new ErrorResponse(200, 'Deleted device sucessfully!'));
        return;
      } catch (err) {
        Server.Logs.error(
          `An error occured when deleting device of ID ${deviceId} - ${err}`
        );
        res
          .status(500)
          .send(
            new ErrorResponse(
              500,
              `An error occured when deleting device of ID ${deviceId}! Please report this to the Bluecherry team along with logs`
            )
          );
        return;
      }
    })
    .catch(err => {
      res
        .status(404)
        .send(
          new ErrorResponse(
            404,
            `A device with the ID ${deviceId} was not found!`
          )
        );
      return;
    });
}
