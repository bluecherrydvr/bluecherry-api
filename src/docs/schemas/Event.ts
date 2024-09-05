const event = {
  type: 'object',
  properties: {
    id: {
      type: 'number',
      examples: [11, 2],
    },
    date: {
      type: 'number',
      examples: [11, 2],
      description: 'The date the event occured given in the ISO date format',
    },
    mediaId: {
      type: 'number',
      examples: [123, 678],
      description:
        'The ID of the media file - This can be used on the `/media/:id` route to retrive the media file',
    },
    mediaUrl: {
      type: 'string',
      examples: [11, 2],
      description: 'URL pointing towards the media file',
    },
    duration: {
      type: 'number',
      examples: [11, 62],
      description: 'The length of the media file given in seconds',
    },
    size: {
      type: 'number',
      examples: [1133, 233561],
      description: 'Size of the media file given in bytes',
    },
  },
};

export {event};
