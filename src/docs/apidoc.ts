import { addDevice } from './devices';
import {addDeviceBody} from './schemas/AddDeviceBody';

const documentation = {
  openapi: '3.1.0',
  info: {
    version: '1.0.0',
    title: 'Bluecherry DRV Server API',
    description:
      'The Bluecherry DVR Server API allows users to use software to create custom intergrations with Blucherry DVR',
    contact: {
      name: 'Bluecherry Team',
      email: 'chall@bluecherry.com', //TODO: Update this email
      url: 'https://github.com/bluecherrydvr/',
    },
    license: {
      name: 'GPL-2.0',
      url: 'https://github.com/bluecherrydvr/bluecherry-apps/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url: `http://${process.env.BC_HOST ?? 'localhost'}:4000/`,
      description: 'Blucherry Server',
    },
  ],
  tags: [{name: 'Devices'}, {name: 'Events'}],

  paths: {
    "/devices": {
      post: addDevice,
    },
  },
  components: {
    securitySchemes: {
      basicAuth: {
        type: 'http',
        scheme: 'basic',
      },
    },
    schemas: {
      addDeviceBody,
    },
  },
};

export = documentation;
