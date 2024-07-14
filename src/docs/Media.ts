const getMedia = {
  tags: ['Media'],
  summary:
    'This route allows you to get information about a media with an id of `mediaId` on the Blucherry server',
  operationId: 'getMedia',
  security: [{basicAuth: {}}],
  parameters: [
    {
      name: 'mediaId',
      in: 'path',
      required: true,
      schema: {
        type: 'integer',
      },
    },
  ],
  responses: {
    '200 - The media was found successfully': {
      description:
        'This status is returned when the media was successfully found and its information returned.',
      headers: {
        'Content-Duration': {
          schema: {
            type: 'Date',
          },
          description: 'The length of the video in hh:mm:ss',
        },
      },
      content: {
        'video/mp4': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
    '400 - Missing media ID': {
      description:
        'This status is returned when the parameter `mediaId` is missing from the path.',
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
                examples: ["The parameter 'mediaID' was not provided"],
              },
            },
          },
        },
      },
    },
  },
};

export {getMedia};
