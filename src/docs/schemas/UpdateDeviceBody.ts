const updateDeviceBody = {
  type: 'object',
  properties: {
    camName: {
      type: 'string',
      examples: ['Back Door', 'Pool'],
    },
    ipAddr: {
      type: 'string',
      examples: ['192.168.255.255', '10.2.5.255'],
    },
    username: {
      type: 'string',
      description: 'The username used to access the camera',
      examples: ['Admin'],
    },
    password: {
      type: 'string',
      description: 'The username used to access the camera',
      format: 'password',
      examples: ['Bluech3rryAdm!n_'],
    },
    protocol: {
      type: 'string',
      description:
        'The protocol to be used to acces this camera. Can only be "IP-RTSP" or "IP-MJPEG"',
      examples: ['IP-RTSP', 'IP-MJPEG'],
    },
    rtspPath: {
      type: 'string',
      examples: ['/'],
    },
    substreamPath: {
      type: 'string',
      examples: [
        '/cam/realmonitor?channel=1&subtype=1&unicast=true&proto=Onvif',
      ],
    },
    rtspPort: {
      type: 'number',
      examples: [80, 554],
    },
    preferTcp: {
      type: 'boolean',
      examples: [true, false],
    },
    substreamMode: {
      type: 'number',
      examples: [0],
    },
    model: {
      type: 'string',
      examples: ['Gerneric', 'Lorex'],
    },
    mjpegPath: {
      type: 'string',
      examples: ['/'],
    },
    mjpegPort: {
      type: 'number',
      examples: [554, 80],
    },
    onvifPort: {
      type: 'number',
      examples: [80],
    },
    audio_enabled: {
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
    disabled: {
      type: 'boolean',
      examples: [false, true],
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
    onvif_events_enabled: {
      type: 'boolean',
      examples: [false, true],
    },
    saturation: {
      type: 'integer',
      examples: [50, 100, 0],
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
export {updateDeviceBody};
