import ErrorResponse from "../models/api/Responses/ErrorResponse";

const addDevice = {
  tags: ['Devices'],
  summary:
    'This route allows you to add a new device or camera to the bluecherry server for use within the software.',
  operationId: 'addDevice',
  security: [{basicAuth: {}}],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/addDeviceBody',
        },
      },
    },
    required: true,
  },
  responses: {
    "200 - The device was created successfully": {
      description: "This status is returned when the device was successfully created. The ID of the newly created device can be found in the `information.deviceId` field.",
      content: {
        "application/json": {
            schema: {
              type: 'object',
              properties:  {
                statusCode: {
                  type: 'number',
                  examples: [200]
                },
                message: {
                  type: 'string',
                  examples: ["Created device sucessfully!"],
                },
                information: {
                  type: 'array',
                  items: {
                    type: 'object'
                  },
                  examples: [ { deviceId: 4 } ]
                }
            } 
          }
        }
      }
    },
    "400 - Missing Fields": {
      description: "This status is returned when the body provided does not have all of the required fields. This response is sent with an additional field named `information` which was an array named `missing` with the names of all the missing required fields.",
      content: {
        "application/json": {
            schema: {
              type: 'object',
              properties:  {
                statusCode: {
                  type: 'number',
                  examples: [400]
                },
                message: {
                  type: 'string',
                  examples: ["Missing fields from your request!"],
                },
                information: {
                  type: 'array',
                  items: {
                    type: 'object'
                  },
                  examples: [ { missing: ["camName", "ipAddr"] } ]
                }
            } 
          }
        }
      }
    },
    "400 - Invalid Body": {
      description: "This status is returned when the body provided does not have all of the fields in the correct format. This usually happens when there is a data type mismatch.",
      content: {
        "application/json": {
            schema: {
              type: 'object',
              properties:  {
                statusCode: {
                  type: 'number',
                  examples: [400]
                },
                message: {
                  type: 'string',
                  examples: ["The body received does not match the expected body! Please refer to the API documentation"],
                },
            } 
          }
        }
      }
    },
    "400 - Invalid Protocol": {
      description: "This status is returned when the protocol provided in field name `protocol` is not one of the accepted values ('IP-RTSP' and 'IP-MJPEG').",
      content: {
        "application/json": {
            schema: {
              type: 'object',
              properties:  {
                statusCode: {
                  type: 'number',
                  examples: [400]
                },
                message: {
                  type: 'string',
                  examples: ["'${body.protocol}' is not a valid protocol! Please use either '`IP-RTSP`' or '`IP-MJPEG`'"],
                }
            } 
          }
        }
      }
    },
    "409 - A device with that name already exists": {
      description: "This status is returned when device was found to already exist with the name provided in the field `camName`.",
      content: {
        "application/json": {
            schema: {
              type: 'object',
              properties:  {
                statusCode: {
                  type: 'number',
                  examples: [409]
                },
                message: {
                  type: 'string',
                  examples: ["A device with the name '${body.camName}' already exists!"],
                }
            } 
          }
        }
      }
    },
    "409 - A device with the same connection details already exists": {
      description: "This status is returned when the connection details provided by the fields `ipAddr`, `port` and `rtsp`",
      content: {
        "application/json": {
            schema: {
              type: 'object',
              properties:  {
                statusCode: {
                  type: 'number',
                  examples: [409]
                },
                message: {
                  type: 'string',
                  examples: ["A device with those connection details already exists!"],
                }
            } 
          }
        }
      }
    }
  },
};
const addDeviceBody = {
  type: 'object',
  required: [
    "camName", 
    "ipAddr", 
    "username", 
    "password", 
    "protocol",
    "rtsp",
    "substream",
    "port",
    "preferTcp"
  ],
  properties: {
    camName: {
      type: 'string',
      examples: ['Back Door', "Pool"],
    },
    ipAddr: {
      type: 'string',
      examples: ['192.168.255.255', '10.2.5.255'],
    },
    username: {
      type: 'string',
      description: "The username used to access the camera",
      examples: ['Admin'],
    },
    password: {
      type: 'string',
      description: "The username used to access the camera",
      format: 'password',
      examples: ['Bluech3rryAdm!n_'],
    },
    protocol: {
      type: 'string',
      description: "The protocol to be used to acces this camera. Can only be \"IP-RTSP\" or \"IP-MJPEG\"",
      examples: ["IP-RTSP", "IP-MJPEG"],
    },
    rtsp: {
      type: 'string',
      examples: ['/'],
    },
    substream: {
      type: 'string',
      examples: ['/cam/realmonitor?channel=1&subtype=1&unicast=true&proto=Onvif'],
    },
    port: {
      type: 'number',
      examples: [80, 554]
    },
    preferTcp: {
      type: 'boolean',
      examples: [true, false]
    },
    model: {
      type: 'string',
      examples: ['Gerneric', 'Lorex'],
    },
    pathMjpeg: {
      type: 'string',
      examples: ['/']
    },
    portMjpeg: {
      type: 'number',
      examples: [554, 80]
    },
    portOnvif: {
      type: 'number',
      examples: [80]
    },
    hls_window_size: {
      type: 'number',
      examples: [5]
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
    }
  },
};

export {addDevice, addDeviceBody};