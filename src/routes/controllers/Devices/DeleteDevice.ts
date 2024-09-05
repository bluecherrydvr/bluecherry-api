import {Request, Response, NextFunction} from 'express';
import ErrorResponse from '../../../models/api/Responses/ErrorResponse';
import {Devices} from '../../../models/db/Device';
import {Server} from '../../../server';
import fs from 'fs';

export async function deleteDevice(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let deviceId = req.params.deviceId ?? -1;

  let attempts = 10;
  let shouldRetry = false;

  //FIXME: Remove this retry loop. This same code is present in PHP due to the posibility of new Media being created while the device is being deleted.
  do {
    attempts--;
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
          Server.sequelize.query(
            `DELETE FROM EventsCam WHERE device_id='${id}'`
          );
          Server.sequelize.query(
            `DELETE FROM OnvifEvents WHERE device_id='${id}'`
          );
          Server.sequelize
            .query(
              `SELECT id, filepath FROM Media WHERE device_id='${id}' ORDER BY id DESC`
            )
            .then((result: [any, any]) => {
              if (result[0].length > 0) {
                let highestId = result[0][0].id;
                result[0].forEach((media: any) => {
                  fs.unlink(media.filepath, err => {
                    if (err) {
                      Server.Logs.error(
                        `An error occured when deleting media belonging to ID ${deviceId} - ${err}`
                      );
                    }
                  });
                });
                try {
                  Server.sequelize.query(
                    `DELETE FROM Media WHERE device_id='${id}' AND id <= ${highestId}`
                  );
                } catch (err) {
                  shouldRetry = true;
                }
              }
            });
          device.destroy();
          res
            .status(200)
            .send(new ErrorResponse(200, 'Deleted device sucessfully!'));
          return;
        } catch (err) {
          shouldRetry = true;
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
  } while (shouldRetry && attempts > 0);

  if (attempts == 0 && shouldRetry) {
    res
      .status(500)
      .send(
        new ErrorResponse(
          500,
          `Failed to deleted the device of ID ${deviceId}! Please report this to the Bluecherry team along with logs`
        )
      );
  }
}
