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
      description: "The date the event occured given in the ISO date format"
    },
    mediaUrl: {
      type: 'number',
      examples: [11, 2],
      description: "URL pointing towards the media file"
    },
    duration: {
      type: 'number',
      examples: [11, 2],
      description: "The length of the media file given in settings"
    },
    size: {
      type: 'number',
      examples: [11, 2],
      description: "Size of the media file given in bytes"
    },
  },
};

export {event};
