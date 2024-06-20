import {Request, Response, NextFunction} from 'express';
import {Devices} from '../../../models/db/Device';
import {AddDeviceRequest} from '../../../models/api/Requests/AddDeviceRequest';
import ErrorResponse from '../../../models/api/Responses/ErrorResponse'

import {Static} from '@sinclair/typebox';
import {Value} from '@sinclair/typebox/value';

export async function addDevice(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  //TODO: Check Licence Limits

  //TODO: Create this data object as a type
  let data: any = Value.Default(AddDeviceRequest, req.body); // TODO: Enable Type checking
 let substream_path;
  if(!Value.Check(AddDeviceRequest, data)) {
    let missing = Object.keys(data).filter(i => data[i] === null)
    if(missing.length > 0) res.status(400).send(new ErrorResponse(400, "Missing fields from your request!", { missing: missing }));
    else res.status(400).send(new ErrorResponse(400, "The body received does not match the expected body! Please refer to the API documentation"));
    return;
  }

  //-> Check if name exists
  const nameCollisions = await Devices.findAll({where: { device_name: data.camName }});

  //-> Device collisions
  if(nameCollisions.length > 0) {
    res.status(409).send(new ErrorResponse(409, `A device with the name "${data.camName}" already exists!`));
    return;
  }

  //-> Protocol Check
  if(data.protocol == "IP-RTSP")  {
    substream_path = `${data.ipAddr}|${data.port}|${data.substream}`;
  }
  else if(data.protocol == "IP-MJPEG") {
    data.pathMjpeg =  !data.rtsp.startsWith("/") ? `/${data.pathMjpeg}` : data.pathMjpeg;
    substream_path = `${data.ipAddr}|${data.portMjpeg}|${data.substream}`;
  }
  else {
    res.status(400).send(new ErrorResponse(400, `'${data.protocol}' is not a valid protocol! Please use either 'IP-RTSP' or 'IP-MJPEG'`));
    return;
  }

  //-> Path Collisions
    const pathCollisions = await Devices.findAll({where: { device: `${data.ipAddr}|${data.port}|${data.rtsp}` }});
    if(pathCollisions.length > 0) {
      res.status(409).send(new ErrorResponse(409, `A device with those connection details already exists!`));
      return;
    }

  //-> Prepare MJPEG path
  Devices.create({
    device_name: data.camName,
    protocol: data.protocol,
    device: `${data.ipAddr}|${data.port}|${data.rtsp}`, //FIXME: Output format does not match those found in the database. 
    mjpeg_path: `${data.ipAddr}|${data.portMjpeg}|${data.pathMjpeg}`,
    audio_disabled: data.audio_enabled ? 0 : 1,
    substream_mode: 0, //TODO: Find out if value ever differs
    substream_path: substream_path,
    debug_level: 0, //TODO: Find pit if value ever differes
    rtsp_username: data.username,
    rtsp_password: data.password,
    model: data.model,
    driver: "",
    rtsp_rtp_prefer_tcp: data.preferTcp,
    onvif_port: data.portOnvif,
    hls_window_size: data.hls_window_size,
    hls_segment_duration: data.hls_segment_duration,
    hls_segment_size: data.hls_segment_size
  }).then((device) => {
    res.status(200).send(new ErrorResponse(200, "Created device sucessfully!", { deviceId: device.toJSON().id }))
  });

}
