import {Request, Response, NextFunction} from 'express';
import ErrorResponse from '../../../models/api/Responses/ErrorResponse';
import {Devices} from '../../../models/db/Device';
import {CreateCameraXML} from '../../../utils/Conversions';
import {Server} from '../../../server';

export async function getDevice(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let deviceId = req.params.deviceId ?? -1;
  let format = req.params.format ?? 'json';

  Devices.findOne({where: {id: deviceId}})
    .then(deviceObject => {
      let device = deviceObject.dataValues;

      Object.keys(device).forEach(function (key) {
        if (device[key] instanceof Buffer) device[key] = `${device[key]}`;
      });
      if (format == 'xml')
        res
          .status(200)
          .set('Content-Type', 'text/xml')
          .json(CreateCameraXML([device]));
      else
        res
          .status(200)
          .set('Content-Type', 'application/json')
          .json({devices: [device]});
    })
    .catch(err => {
      Server.Logs.error(
        `An error occured when getting device of ID ${deviceId} - ${err}`
      );
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

export async function getDevices(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let deviceId = req.params.deviceId ?? -1;
  let format = req.params.format ?? 'json';

  Devices.findAll()
    .then(deviceArray => {
      deviceArray.forEach(deviceObject => {
        let device = deviceObject.dataValues;
        Object.keys(device).forEach(function (key) {
          if (device[key] instanceof Buffer) device[key] = `${device[key]}`;
        });
      });

      if (format == 'xml')
        res
          .status(200)
          .set('Content-Type', 'text/xml')
          .json(CreateCameraXML(deviceArray.map(d => d.dataValues)));
      else
        res
          .status(200)
          .set('Content-Type', 'application/json')
          .json({devices: deviceArray});
    })
    .catch(err => {
      Server.Logs.error(
        `An error occured when getting device of ID ${deviceId} - ${err}`
      );
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
