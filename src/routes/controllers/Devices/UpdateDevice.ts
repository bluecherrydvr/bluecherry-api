import {Request, Response, NextFunction} from 'express';
import {Devices} from '../../../models/db/Device';
import {UpdateDeviceRequest} from '../../../models/api/Requests/UpdateDeviceRequest';
import ErrorResponse from '../../../models/api/Responses/ErrorResponse';

import {Value} from '@sinclair/typebox/value';

export async function updateDevice(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let deviceId = req.params.deviceId ?? -1;
  //TODO: Check Licence Limits

  //TODO: Create this data object as a type
  let data: any = Value.Default(UpdateDeviceRequest, req.body); // TODO: Enable Type checking
  let substream_path;

  //-> Check if the
  if (!Value.Check(UpdateDeviceRequest, data)) {
    if (data.length > 0)
      res
        .status(400)
        .send(
          new ErrorResponse(
            400,
            'You need to edit at least 1 property of the device!'
          )
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

  let originalDevice = await Devices.findOne({where: {id: deviceId}});
  let poppedDevice = `${originalDevice.dataValues.device}`.split('|');
  let poppedMjpegPath = `${originalDevice.dataValues.mjpeg_path}`.split('|');
  let poppedSubstream = `${originalDevice.dataValues.substream_path}`.split(
    '|'
  );
  let oldProps = {
    ipAddress: poppedDevice[0],
    rtspPort: poppedDevice[1],
    rtspPath: poppedDevice[2],
    substreamPath: poppedSubstream[2],
    mjpegPort: poppedMjpegPath[1],
    mjpegPath: poppedMjpegPath[2],
    protocol: originalDevice.dataValues.protocol
  };

  //-> Check if name exists
  if ('camName' in data) {
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
  }

  if ('protocol' in data || 'substreamPath' in data) {

    let protocol = data.protocol ?? oldProps.protocol;

    //-> Protocol Check
    if (protocol == 'IP-RTSP') {
      substream_path = `${data.ipAddress ?? oldProps.ipAddress}|${data.rtspPort ?? oldProps.rtspPort}|${data.substreamPath ?? oldProps.substreamPath}`;
    } else if (protocol == 'IP-MJPEG') {
      data.mjpegPath = !data.rtspPath.startsWith('/')
        ? `/${data.mjpegPath}`
        : data.mjpegPath;
      substream_path = `${data.ipAddress ?? oldProps.ipAddress}|${data.rtspPort ?? oldProps.mjpegPort ?? 80}|${data.substreamPath ?? oldProps.substreamPath}`;
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
  }
  //-> Path Collisions
  const pathCollisions = await Devices.findAll({
    where: {
      device: `${data.ipAddress ?? oldProps.ipAddress}|${data.rtspPort ?? oldProps.rtspPort}|${data.rtspPath ?? oldProps.rtspPath}`,
    },
  });
  if (pathCollisions.length > 0) {
    if (!pathCollisions.some(device => device.dataValues.id == deviceId)) {
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
  }

  //-> Update device
  Devices.update(
    {
      device_name: data.camName ?? originalDevice.dataValues.device_name,
      protocol: data.protocol ?? originalDevice.dataValues.protocol,
      device: `${data.ipAddress ?? oldProps.ipAddress}|${data.rtspPort ?? oldProps.rtspPort}|${data.rtspPath ?? oldProps.rtspPath}`,
      mjpeg_path: `${data.ipAddress ?? oldProps.ipAddress}|${data.mjpegPort ?? oldProps.mjpegPort ?? 80}|${data.mjpegPath ?? oldProps.mjpegPort ?? '/'}`,
      audio_disabled:
        'audioEnabled' in data
          ? data.audioEnabled
            ? 0
            : 1
          : originalDevice.dataValues.audio_enabled,
      substream_mode:
        data.substreamMode ?? originalDevice.dataValues.substreamMode,
      substream_path: substream_path,
      rtsp_username: data.username ?? originalDevice.dataValues.username,
      rtsp_password: data.password ?? originalDevice.dataValues.password,
      rtsp_rtp_prefer_tcp:
        data.preferTcp ?? originalDevice.dataValues.preferTcp,
      onvif_port: data.onvifPort ?? originalDevice.dataValues.onvifPort,
      hls_window_size:
        data.hlsWindowSize ?? originalDevice.dataValues.hlsWindowSize,
      hls_segment_duration:
        data.hlsSegmentDuration ??
        originalDevice.dataValues.hls_segment_duration,
      hls_segment_size:
        data.hlsSegmentSize ?? originalDevice.dataValues.hls_segment_size,
      audio_volume: data.audioVolume ?? originalDevice.dataValues.audio_volume,
      brightness: data.brightness ?? originalDevice.dataValues.brightness,
      buffer_postrecording:
        data.bufferPostrecording ??
        originalDevice.dataValues.buffer_postrecording,
      channel: data.channel ?? originalDevice.dataValues.channel,
      contrast: data.contrast ?? originalDevice.dataValues.contrast,
      disabled: data.disabled ?? originalDevice.dataValues.disabled,
      frame_downscale_factor:
        data.frameDownscaleFactor ??
        originalDevice.dataValues.frame_downscale_factor,
      invert: data.invert ?? originalDevice.dataValues.invert,
      max_motion_area:
        data.maxMotionArea ?? originalDevice.dataValues.max_motion_area,
      max_motion_frames:
        data.maxMotionFrames ?? originalDevice.dataValues.max_motion_frames,
      min_motion_frames:
        data.minMotionFrames ?? originalDevice.dataValues.min_motion_frames,
      motion_algorithm:
        data.motionAlgorithm ?? originalDevice.dataValues.motion_algorithm,
      motion_analysis_percentage:
        data.motionAnalysisPercentage ??
        originalDevice.dataValues.motion_analysis_percentage,
      motion_analysis_ssw_length:
        data.motionAnalysisSswLength ??
        originalDevice.dataValues.motion_analysis_ssw_length,
      motion_blend_ratio:
        data.motionBlendRatio ?? originalDevice.dataValues.motion_blend_ratio,
      motion_debug: data.motionDebug ?? originalDevice.dataValues.motion_debug,
      // motion_map: Type.Optional(Type.String()), //TODO: Add support for Motion Map
      onvif_events_enabled:
        data.onvifEventsEnabled ??
        originalDevice.dataValues.onvif_events_enabled,
      saturation: data.saturation ?? originalDevice.dataValues.saturation,
      // schedule: Type.Optional(Type.String()), //TODO: Add support for Schedule
      schedule_override_global:
        data.scheduleOverrideGlobal ??
        originalDevice.dataValues.schedule_override_global,
      signal_type: data.signalType ?? originalDevice.dataValues.signal_type,
      video_interval:
        data.videoInterval ?? originalDevice.dataValues.video_interval,
      video_quality:
        data.videoQuality ?? originalDevice.dataValues.video_quality,
    },
    {where: {id: deviceId}}
  ).then(async () => {
    res.status(200).send(new ErrorResponse(200, 'Updated device sucessfully!'));
  });
}
