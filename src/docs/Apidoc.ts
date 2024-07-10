import {addDevice, deleteDevice, getDevice, getDevices} from './Devices';
import {getEvent, getEvents} from './Events';
import { getMedia } from './Media';
import {addDeviceBody} from './schemas/AddDeviceBody';
import {device} from './schemas/Device';
import {event} from './schemas/Event';


const documentation = {
  openapi: '3.1.0',
  info: {
    version: '0.3.2',
    title: 'Bluecherry DRV Server API',
    description:
      'The Bluecherry DVR Server API allows users to use software to create custom intergrations with Blucherry DVR',
    contact: {
      name: 'Bluecherry Team',
      email: 'chall@corp.bluecherry.com', //TODO: Update this email
      url: 'https://github.com/bluecherrydvr/',
    },
    license: {
      name: 'AGPL-2.0',
      url: 'https://github.com/bluecherrydvr/bluecherry-api/blob/master/LICENSE',
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
    '/devices': {
      post: addDevice,
    },
    '/devices/{deviceId}': {
      delete: deleteDevice,
    },
    '/devices/{format}': {
      get: getDevices,
    },
    '/devices/{deviceId}/{format}': {
      get: getDevice,
    },
    '/events/': {
      get: getEvents,
    },
    '/events/{eventId}': {
      get: getEvent,
    },
    '/media/{mediaId}': {
      get: getMedia,
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
      device,
      event
    },
  },
};

export = documentation;
