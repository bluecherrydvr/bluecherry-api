const ErrorResponse = {
    type: 'object',
    required: [
        "statusCode",
        "message"
    ],
    properties: {
      statusCode: {
        type: 'number',
        examples: [200],
      },
      message: {
        type: 'string',
        examples: ['The device has been created successfully!'],
      },
      information: {
        type: 'object',
        examples: [{}],
      }
    }
}

export { ErrorResponse }