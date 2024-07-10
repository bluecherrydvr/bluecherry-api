import {Request, Response, NextFunction} from 'express';
import {Devices} from '../../../models/db/Device';
import {AddDeviceRequest} from '../../../models/api/Requests/AddDeviceRequest';
import ErrorResponse from '../../../models/api/Responses/ErrorResponse';

import {Value} from '@sinclair/typebox/value';
import {Server} from '../../../server';

export async function addDevice(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  //TODO: Check Licence Limits

  //TODO: Create this data object as a type
  let data: any = Value.Default(AddDeviceRequest, req.body); // TODO: Enable Type checking
  let substream_path;
  if (!Value.Check(AddDeviceRequest, data)) {
    let missing = Object.keys(data).filter(i => data[i] === null);
    if (missing.length > 0)
      res.status(400).send(
        new ErrorResponse(400, 'Missing fields from your request!', {
          missing: missing,
        })
      );
    else
      res
        .status(400)
        .send(
          new ErrorResponse(
            400,
            'The body received does not match the expected body! Please refer to the API documentation'
          )
        );
    return;
  }

  //-> Check if name exists
  const nameCollisions = await Devices.findAll({
    where: {device_name: data.camName},
  });

  //-> Device collisions
  if (nameCollisions.length > 0) {
    res
      .status(409)
      .send(
        new ErrorResponse(
          409,
          `A device with the name "${data.camName}" already exists!`
        )
      );
    return;
  }

  //-> Protocol Check
  if (data.protocol == 'IP-RTSP') {
    substream_path = `${data.ipAddress}|${data.rtspPort}|${data.substreamPath}`;
  } else if (data.protocol == 'IP-MJPEG') {
    data.mjpegPath = !data.rtspPath.startsWith('/')
      ? `/${data.mjpegPath}`
      : data.mjpegPath;
    substream_path = `${data.ipAddress}|${data.mjpegPort}|${data.substreamPath}`;
  } else {
    res
      .status(400)
      .send(
        new ErrorResponse(
          400,
          `'${data.protocol}' is not a valid protocol! Please use either 'IP-RTSP' or 'IP-MJPEG'`
        )
      );
    return;
  }

  //-> Path Collisions
  const pathCollisions = await Devices.findAll({
    where: {device: `${data.ipAddress}|${data.rtspPort}|${data.rtspPath}`},
  });
  if (pathCollisions.length > 0) {
    res
      .status(409)
      .send(
        new ErrorResponse(
          409,
          `A device with those connection details already exists!`
        )
      );
    return;
  }

  //-> Prepare MJPEG path
  Devices.create({
    device_name: data.camName,
    protocol: data.protocol,
    device: `${data.ipAddress}|${data.rtspPort}|${data.rtspPath}`,
    mjpeg_path: `${data.ipAddress}|${data.mjpegPort}|${data.mjpegPath}`,
    audio_disabled: data.audio_enabled ? 0 : 1,
    substream_mode: data.substreamMode,
    substream_path: substream_path,
    debug_level: 0,
    rtsp_username: data.username,
    rtsp_password: data.password,
    model: data.model,
    driver: '', //-> Default values to satisfy BC Server
    resolutionX: 640,
    resolutionY: 480,
    rtsp_rtp_prefer_tcp: data.preferTcp,
    onvif_port: data.onvifPort,
    hls_window_size: data.hls_window_size,
    hls_segment_duration: data.hls_segment_duration,
    hls_segment_size: data.hls_segment_size,
  }).then(async device => {
    let d = await Devices.findOne({where: {device: device.dataValues.device}}); //-> Work around because sequalize nulls id
    res.status(200).send(
      new ErrorResponse(200, 'Created device sucessfully!', {
        deviceId: d.dataValues.id,
      })
    );
  });
}
