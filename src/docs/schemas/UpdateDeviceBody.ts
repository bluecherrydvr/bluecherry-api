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
    audioEnabled: {
      type: 'boolean',
      examples: [false, true],
    },
    audioVolume: {
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
    frameDownscaleFactor: {
      type: 'number',
      format: 'float',
      examples: [0.5, 0.8],
    },
    hlsSegmentDuration: {
      type: 'number',
      format: 'float',
      examples: [0.0, 0.1],
    },
    hlsSegmentSize: {
      type: 'integer',
      examples: [0, 1],
    },
    hlsWindowSize: {
      type: 'integer',
      examples: [5, 7],
    },
    invert: {
      type: 'boolean',
      examples: [false, true],
    },
    maxMotionArea: {
      type: 'integer',
      examples: [90, 50],
    },
    maxMotionFrames: {
      type: 'integer',
      examples: [20, 50],
    },
    minMotionFrames: {
      type: 'integer',
      examples: [15, 30, 60],
    },
    motionAlgorithm: {
      type: 'boolean',
      examples: [true, false],
    },
    motionAnalysisPercentage: {
      type: 'integer',
      examples: [-1, 30, 70],
    },
    motionAnalysisSswLength: {
      type: 'integer',
      examples: [-1, 30, 70],
    },
    motionBlendRatio: {
      type: 'integer',
      examples: [15, 30, 60],
    },
    motionDebug: {
      type: 'boolean',
      examples: [false, true],
    },
    onvifEventsEnabled: {
      type: 'boolean',
      examples: [false, true],
    },
    saturation: {
      type: 'integer',
      examples: [50, 100, 0],
    },
    scheduleOverrideGlobal: {
      type: 'boolean',
      examples: [false, true],
    },
    signalType: {
      type: 'string',
      examples: ['null'],
    },
    videoInterval: {
      type: 'string',
      examples: ['null'],
    },
    videoQuality: {
      type: 'integer',
      examples: [100, 50],
    },
  },
};
export {updateDeviceBody};
