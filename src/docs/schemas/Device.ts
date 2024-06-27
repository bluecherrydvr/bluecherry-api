const device = {
  type: 'object',
  properties: {
    audio_disabled: {
      type: 'boolean',
      examples: [false, true],
    },
    audio_volume: {
      type: 'integer',
      examples: [50, 100, 0],
    },
    brightness: {
      type: 'integer',
      examples: [50, 100, 0],
    },
    channel: {
      type: 'integer',
      examples: [0, 1],
    },
    contrast: {
      type: 'integer',
      examples: [50, 100, 0],
    },
    debug_level: {
      type: 'integer',
      examples: [0, 1],
    },
    device: {
      type: 'string',
      examples: ['192.168.255.255|80|/'],
    },
    device_name: {
      type: 'string',
      examples: ['Back Door'],
    },
    disabled: {
      type: 'boolean',
      examples: [false, true],
    },
    driver: {
      type: 'string',
      examples: [''],
    },
    frame_downscale_factor: {
      type: 'number',
      format: 'float',
      examples: [0.5, 0.8],
    },
    hls_segment_duration: {
      type: 'number',
      format: 'float',
      examples: [0.0, 0.1],
    },
    hls_segment_size: {
      type: 'integer',
      examples: [0, 1],
    },
    hls_window_size: {
      type: 'integer',
      examples: [5, 7],
    },
    id: {
      type: 'integer',
      examples: [14, 265],
    },
    invert: {
      type: 'boolean',
      examples: [false, true],
    },
    max_motion_area: {
      type: 'integer',
      examples: [90, 50],
    },
    max_motion_frames: {
      type: 'integer',
      examples: [20, 50],
    },
    min_motion_frames: {
      type: 'integer',
      examples: [15, 30, 60],
    },
    mjpeg_path: {
      type: 'string',
      examples: ['192.168.255.255|80|/'],
    },
    model: {
      type: 'string',
      examples: ['Generic', '0'],
    },
    motion_algorithm: {
      type: 'boolean',
      examples: [true, false],
    },
    motion_analysis_percentage: {
      type: 'integer',
      examples: [-1, 30, 70],
    },
    motion_analysis_ssw_length: {
      type: 'integer',
      examples: [-1, 30, 70],
    },
    motion_blend_ratio: {
      type: 'integer',
      examples: [15, 30, 60],
    },
    motion_debug: {
      type: 'boolean',
      examples: [false, true],
    },
    motion_map: {
      type: 'string',
      examples: ['...'],
    },
    onvif_events_enabled: {
      type: 'boolean',
      examples: [false, true],
    },
    onvif_port: {
      type: 'integer',
      examples: [80, 554],
    },
    protocol: {
      type: 'string',
      examples: ['IP-RTSP', 'IP-MJPEG'],
    },
    ptz_control_path: {
      type: 'string',
      examples: ['null'],
    },
    ptz_serial_values: {
      type: 'string',
      examples: ['null'],
    },
    reencode_bitrate: {
      type: 'integer',
      examples: [64000],
    },
    reencode_frame_height: {
      type: 'integer',
      examples: [240, 352],
    },
    reencode_frame_width: {
      type: 'integer',
      examples: [352, 240],
    },
    reencode_livestream: {
      type: 'boolean',
      examples: [false, true],
    },
    resolutionX: {
      type: 'integer',
      examples: [640, 480],
    },
    resolutionY: {
      type: 'integer',
      examples: [480, 640],
    },
    rtsp_username: {
      type: 'string',
      examples: ['Admin'],
    },
    rtsp_password: {
      type: 'string',
      examples: ['Bluech3rryAdm!n_'],
    },
    saturation: {
      type: 'integer',
      examples: [50, 100, 0],
    },
    schedule: {
      type: 'string',
      examples: ['...'],
    },
    schedule_override_global: {
      type: 'boolean',
      examples: [false, true],
    },
    signal_type: {
      type: 'string',
      examples: ['null'],
    },
    substream_mode: {
      type: 'boolean',
      examples: [false, true],
    },
    substream_path: {
      type: 'string',
      examples: [
        '192.168.255.255|80|/cam/realmonitor?channel=1&subtype=1&unicast=true&proto=Onvif',
      ],
    },
    video_interval: {
      type: 'string',
      examples: ['null'],
    },
    video_quality: {
      type: 'integer',
      examples: [100, 50],
    },
  },
};

export {device};
