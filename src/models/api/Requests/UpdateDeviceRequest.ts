import {Type} from '@sinclair/typebox';

const UpdateDeviceRequest = Type.Object({
  camName: Type.String(),
  ipAddress: Type.Optional(Type.String()),
  username: Type.Optional(Type.String()),
  password: Type.Optional(Type.String()),
  protocol: Type.Optional(Type.String()),
  rtspPath: Type.Optional(Type.String()),
  substreamPath: Type.Optional(Type.String()),
  rtspPort: Type.Optional(Type.Integer()),
  preferTcp: Type.Optional(Type.Boolean()),
  substreamMode: Type.Optional(Type.Boolean()),
  mjpegPath: Type.Optional(Type.String()),
  mjpegPort: Type.Optional(Type.Number()),
  onvifPort: Type.Optional(Type.Number()),
  audio_enabled: Type.Optional(Type.Boolean()),
  audio_volume: Type.Optional(Type.Integer()),
  brightness: Type.Optional(Type.Integer()),
  buffer_postrecording: Type.Optional(Type.Integer()),
  channel: Type.Optional(Type.Integer()),
  contrast: Type.Optional(Type.Integer()),
  disabled: Type.Optional(Type.Boolean()),
  frame_downscale_factor: Type.Optional(Type.Number()),
  hls_segment_duration: Type.Optional(Type.Number()),
  hls_segment_size: Type.Optional(Type.Integer()),
  hls_window_size: Type.Optional(Type.Integer()),
  invert: Type.Optional(Type.Boolean()),
  max_motion_area: Type.Optional(Type.Integer()),
  max_motion_frames: Type.Optional(Type.Integer()),
  min_motion_frames: Type.Optional(Type.Integer()),
  motion_algorithm: Type.Optional(Type.Boolean()),
  motion_analysis_percentage: Type.Optional(Type.Integer()),
  motion_analysis_ssw_length: Type.Optional(Type.Integer()),
  motion_blend_ratio: Type.Optional(Type.Integer()),
  motion_debug: Type.Optional(Type.Boolean()),
  // motion_map: Type.Optional(Type.String()), //TODO: Add support for Schedule
  onvif_events_enabled: Type.Optional(Type.Boolean()),
  saturation: Type.Optional(Type.Integer()),
  // schedule: Type.Optional(Type.String()), //TODO: Add support for Schedule
  schedule_override_global: Type.Optional(Type.Boolean()),
  signal_type: Type.Optional(Type.String()),
  video_interval: Type.Optional(Type.Integer()),
  video_quality: Type.Optional(Type.Integer()),
});

export {UpdateDeviceRequest};