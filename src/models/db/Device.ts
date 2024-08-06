import {DataTypes, Model} from 'sequelize';
import {Server} from '../../server';

class Devices extends Model {}

function Register(sequelize = Server.sequelize): void {
  Devices.init(
    {
      audio_disabled: DataTypes.BOOLEAN,
      audio_volume: DataTypes.SMALLINT,
      brightness: DataTypes.SMALLINT,
      buffer_postrecording: DataTypes.SMALLINT,
      channel: DataTypes.INTEGER,
      contrast: DataTypes.SMALLINT,
      debug_level: DataTypes.TINYINT,
      device: DataTypes.STRING,
      device_name: DataTypes.STRING,
      disabled: DataTypes.BOOLEAN,
      driver: DataTypes.STRING,
      frame_downscale_factor: DataTypes.DECIMAL,
      hls_segment_duration: DataTypes.DECIMAL,
      hls_segment_size: DataTypes.INTEGER,
      hls_window_size: DataTypes.SMALLINT,
      id: {primaryKey: true, type: DataTypes.INTEGER},
      invert: DataTypes.BOOLEAN,
      max_motion_area: DataTypes.SMALLINT,
      max_motion_frames: DataTypes.SMALLINT,
      min_motion_frames: DataTypes.SMALLINT,
      mjpeg_path: DataTypes.STRING,
      model: DataTypes.STRING,
      motion_algorithm: DataTypes.BOOLEAN,
      motion_analysis_percentage: DataTypes.INTEGER,
      motion_analysis_ssw_length: DataTypes.INTEGER,
      motion_blend_ratio: DataTypes.SMALLINT,
      motion_debug: DataTypes.BOOLEAN,
      motion_map: DataTypes.STRING,
      onvif_events_enabled: DataTypes.BOOLEAN,
      onvif_port: DataTypes.MEDIUMINT,
      protocol: DataTypes.STRING,
      ptz_control_path: DataTypes.STRING,
      ptz_control_protocol: DataTypes.STRING,
      ptz_serial_values: DataTypes.STRING,
      reencode_bitrate: DataTypes.INTEGER,
      reencode_frame_height: DataTypes.SMALLINT,
      reencode_frame_width: DataTypes.SMALLINT,
      reencode_livestream: DataTypes.BOOLEAN,
      resolutionX: DataTypes.SMALLINT,
      resolutionY: DataTypes.SMALLINT,
      rtsp_username: DataTypes.STRING,
      rtsp_password: DataTypes.STRING,
      saturation: DataTypes.SMALLINT,
      schedule: {type: 'VARCHAR(168)'},
      schedule_override_global: DataTypes.BOOLEAN,
      signal_type: DataTypes.STRING,
      substream_mode: DataTypes.BOOLEAN,
      substream_path: DataTypes.STRING,
      video_interval: DataTypes.SMALLINT,
      video_quality: DataTypes.SMALLINT,
    },
    {sequelize: sequelize, modelName: 'Devices'}
  );
}

export {Devices};
export default {Devices, Register};
