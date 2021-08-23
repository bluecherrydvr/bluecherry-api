const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'Devices';

const Devices = sequelize.define('Devices', {
  device_name: {
    type: Sequelize.STRING(100),
    unique: true,
  },
  protocol: {
    type: Sequelize.STRING(50),
  },
  driver: {
    type: Sequelize.STRING,
  },
  rtsp_username: {
    type: Sequelize.STRING,
  },
  rtsp_password: {
    type: Sequelize.STRING,
  },
  rtsp_rtp_prefer_tcp: {
    type: Sequelize.BOOLEAN,
    defaultValue: 1,
  },
  mjpeg_path: {
    type: Sequelize.STRING,
  },
  onvif_port: {
    type: Sequelize.INTEGER,
    defaultValue: 80,
  },
  ptz_control_path: {
    type: Sequelize.STRING,
  },
  ptz_control_protocol: {
    type: Sequelize.STRING(32),
  },
  ptz_serial_values: {
    type: Sequelize.STRING(64),
  },
  resolutionX: {
    type: Sequelize.SMALLINT,
  },
  resolutionY: {
    type: Sequelize.SMALLINT,
  },
  model: {
    type: Sequelize.STRING,
  },
  invert: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  channel: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  audio_volume: {
    type: Sequelize.SMALLINT,
    defaultValue: 50,
  },
  saturation: {
    type: Sequelize.SMALLINT,
    defaultValue: 50,
  },
  brightness: {
    type: Sequelize.SMALLINT,
    defaultValue: 50,
  },
  hue: {
    type: Sequelize.SMALLINT,
    defaultValue: 50,
  },
  contrast: {
    type: Sequelize.SMALLINT,
    defaultValue: 50,
  },
  video_quality: {
    type: Sequelize.SMALLINT,
    defaultValue: 100,
  },
  video_interval: {
    type: Sequelize.SMALLINT,
  },
  signal_type: {
    type: Sequelize.STRING(6),
  },
  buffer_prerecording: {
    type: Sequelize.SMALLINT,
    defaultValue: 3,
  },
  buffer_postrecording: {
    type: Sequelize.SMALLINT,
    defaultValue: 3,
  },
  motion_map: {
    type: Sequelize.STRING,
    defaultValue: '333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333',
  },
  motion_algorithm: {
    type: Sequelize.BOOLEAN,
    defaultValue: 1,
  },
  frame_downscale_factor: {
    type: Sequelize.DECIMAL,
    defaultValue: 0.500,
  },
  min_motion_area: {
    type: Sequelize.SMALLINT,
    defaultValue: 5,
  },
  max_motion_area: {
    type: Sequelize.SMALLINT,
    defaultValue: 90,
  },
  motion_analysis_ssw_length: {
    type: Sequelize.INTEGER,
    defaultValue: -1,
  },
  motion_analysis_percentage: {
    type: Sequelize.INTEGER,
    defaultValue: -1,
  },
  schedule: {
    type: Sequelize.STRING,
    defaultValue: 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
  },
  schedule_override_global: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  disabled: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  audio_disabled: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  debug_level: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  reencode_livestream: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  reencode_bitrate: {
    type: Sequelize.INTEGER,
    defaultValue: 64000,
  },
  reencode_frame_width: {
    type: Sequelize.SMALLINT,
    defaultValue: 352,
  },
  reencode_frame_height: {
    type: Sequelize.SMALLINT,
    defaultValue: 240,
  },
  substream_mode: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  substream_path: {
    type: Sequelize.STRING,
  },
  onvif_events_enabled: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  min_motion_frames: {
    type: Sequelize.SMALLINT,
    defaultValue: 15,
  },
  max_motion_frames: {
    type: Sequelize.SMALLINT,
    defaultValue: 20,
  },
  motion_blend_ratio: {
    type: Sequelize.SMALLINT,
    defaultValue: 15,
  },
  motion_debug: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName, timestamps: false, createdAt: false, updatedAt: false,
});

// eslint-disable-next-line
Devices.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = Devices;
