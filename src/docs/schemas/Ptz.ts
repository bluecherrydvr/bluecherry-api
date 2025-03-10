const ptzOperations = {
  tags: ['PTZ'],
  ptzContinuous: {
    summary: 'Move camera continuously in specified direction',
    operationId: 'ptzContinuous',
    security: [{ basicAuth: {} }],
    parameters: [
      {
        name: 'deviceId',
        in: 'path',
        required: true,
        schema: { type: 'integer' }
      }
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/ptzContinuous'
          }
        }
      },
      required: true
    },
    responses: {
      '200': {
        description: 'Camera movement initiated successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'PTZ movement initiated' }
              }
            }
          }
        }
      }
    }
  },

  ptzAbsolute: {
    summary: 'Move camera to absolute position',
    operationId: 'ptzAbsolute',
    security: [{ basicAuth: {} }],
    parameters: [
      {
        name: 'deviceId',
        in: 'path',
        required: true,
        schema: { type: 'integer' }
      }
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/ptzAbsolute'
          }
        }
      },
      required: true
    },
    responses: {
      '200': {
        description: 'Camera moved to position successfully'
      }
    }
  },

  getPtzPresets: {
    summary: 'Get all PTZ presets for a device',
    operationId: 'getPtzPresets',
    security: [{ basicAuth: {} }],
    parameters: [
      {
        name: 'deviceId',
        in: 'path',
        required: true,
        schema: { type: 'integer' }
      }
    ],
    responses: {
      '200': {
        description: 'List of PTZ presets',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ptzPreset'
              }
            }
          }
        }
      }
    }
  }
};

export { ptzOperations };

