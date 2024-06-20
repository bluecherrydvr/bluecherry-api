const addDeviceBody = {
  type: 'object',
  required: [
    'camName',
    'ipAddr',
    'username',
    'password',
    'protocol',
    'rtsp',
    'substream',
    'port',
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
    rtsp: {
      type: 'string',
      examples: ['/'],
    },
    substream: {
      type: 'string',
      examples: [
        '/cam/realmonitor?channel=1&subtype=1&unicast=true&proto=Onvif',
      ],
    },
    port: {
      type: 'number',
      examples: [80, 554],
    },
    preferTcp: {
      type: 'boolean',
      examples: [true, false],
    },
    model: {
      type: 'string',
      examples: ['Gerneric', 'Lorex'],
    },
    pathMjpeg: {
      type: 'string',
      examples: ['/'],
    },
    portMjpeg: {
      type: 'number',
      examples: [554, 80],
    },
    portOnvif: {
      type: 'number',
      examples: [80],
    },
    hls_window_size: {
      type: 'number',
      examples: [5],
    },
    hls_segment_size: {
      type: 'number',
    },
    hls_segment_duration: {
      type: 'number',
    },
    audio_enabled: {
      type: 'boolean',
      examples: [false, true],
    },
  },
};

export {addDeviceBody};
