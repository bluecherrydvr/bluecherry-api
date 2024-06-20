import {Type} from '@sinclair/typebox';

const AddDeviceRequest = Type.Object({
  camName: Type.String({ default: null }),
  ipAddr: Type.String({ default: null }),
  username: Type.String({ default: null }),
  password: Type.String({ default: null }),
  protocol: Type.String({ default: null }),
  rtsp: Type.String({ default: null }),
  substream: Type.String({ default: null }),
  port: Type.Integer({ default: null }),
  preferTcp: Type.Boolean({ default: null }),
  model: Type.Optional(Type.String({default: 0})),
  pathMjpeg: Type.Optional(Type.String({ default: "" })),
  portMjpeg: Type.Optional(Type.Number()),
  portOnvif: Type.Optional(Type.Number({ default: 80 })),
  hls_window_size: Type.Optional(Type.Number({ default: 5 })),
  hls_segment_size: Type.Optional(Type.Number()),
  hls_segment_duration: Type.Optional(Type.Number()),
  audio_enabled: Type.Optional(Type.Boolean({default: false})),
});

export {AddDeviceRequest };
