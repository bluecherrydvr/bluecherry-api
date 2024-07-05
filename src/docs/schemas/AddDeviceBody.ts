const addDeviceBody = {
  type: 'object',
  required: [
    'camName',
    'ipAddr',
    'username',
    'password',
    'protocol',
    'rtspPath',
    'substream',
    'substreamPath',
    'rtspPort',
    'preferTcp',
  ],
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
    hlsWindowSize: {
      type: 'number',
      examples: [5],
    },
    hlsSegmentSize: {
      type: 'number',
    },
    hlsSegmentDuration: {
      type: 'number',
    },
    audioEnabled: {
      type: 'boolean',
      examples: [false, true],
    },
  },
};

export {addDeviceBody};
