  const getEvent = {
    tags: ['events'],
    summary:
      'This route allows you to get infomration about a event with an id of `eventId` on the Blucherry server',
    operationId: 'getEvent',
    security: [{basicAuth: {}}],
    parameters: [
      {
        name: 'eventId',
        in: 'path',
        required: true,
        schema: {
          type: 'integer',
        },
      },
    ],
    responses: {
      '200 - The event was found successfully': {
        description:
          'This status is returned when the event was successfully found and its information returned.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                statusCode: {
                  type: 'number',
                  examples: [200],
                },
                message: {
                  type: 'string',
                  examples: ['Found event sucessfully!'],
                },
              },
            },
          },
        },
      },
      '400 - Missing event ID': {
        description:
          'This status is returned when the parameter `eventId` is missing from the path.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                statusCode: {
                  type: 'number',
                  examples: [400],
                },
                message: {
                  type: 'string',
                  examples: ["The parameter 'eventID' was not provided"],
                },
              },
            },
          },
        },
      },
    },
  };
  
  const getEvents = {
    tags: ['events'],
    summary:
      'This route allows you to get infomration about all events on the Blucherry server',
    operationId: 'getEvents',
    security: [{basicAuth: {}}],
    parameters: [
      {
        name: 'limit',
        in: 'query ', //FIXME: Swagger doesn't use query parameters??
        required: false,
        schema: {
          type: 'number',
        },
      },
    ],
    responses: {
      '200 - The event was found': {
        description:
          'This status is returned when the event was successfully found and its information returned.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                events: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/event', //FIXME: Swagger no like the foramt?? 
                  },
                },
              },
            },
          },
        },
      },
      '400 - Missing event ID': {
        description:
          'This status is returned when the parameter `eventId` is missing from the path.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                statusCode: {
                  type: 'number',
                  examples: [400],
                },
                message: {
                  type: 'string',
                  examples: ["The parameter 'eventID' was not provided"],
                },
              },
            },
          },
        },
      },
    },
  };
  
  export {getEvent, getEvents};
  