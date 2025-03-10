const ptzOperations = {
  ptzContinuous: {
    type: 'object',
    required: ['x', 'y', 'zoom'],
    properties: {
      x: {
        type: 'number',
        description: 'Pan speed (-1.0 to 1.0)',
        examples: [-0.5, 0, 1.0]
      },
      y: {
        type: 'number',
        description: 'Tilt speed (-1.0 to 1.0)',
        examples: [-0.5, 0, 1.0]
      },
      zoom: {
        type: 'number',
        description: 'Zoom speed (-1.0 to 1.0)',
        examples: [-0.5, 0, 1.0]
      }
    }
  },
  ptzAbsolute: {
    type: 'object',
    required: ['x', 'y', 'zoom'],
    properties: {
      x: {
        type: 'number',
        description: 'Absolute pan position (0.0 to 1.0)',
        examples: [0.0, 0.5, 1.0]
      },
      y: {
        type: 'number',
        description: 'Absolute tilt position (0.0 to 1.0)',
        examples: [0.0, 0.5, 1.0]
      },
      zoom: {
        type: 'number',
        description: 'Absolute zoom position (0.0 to 1.0)',
        examples: [0.0, 0.5, 1.0]
      }
    }
  },
  ptzPreset: {
    type: 'object',
    properties: {
      presetName: {
        type: 'string',
        description: 'Name of the preset position',
        examples: ['Entry', 'Parking Lot', 'Front Door']
      },
      presetToken: {
        type: 'string',
        description: 'Token identifying the preset position',
        examples: ['1', '2', '3']
      }
    }
  }
};

export { ptzOperations };

