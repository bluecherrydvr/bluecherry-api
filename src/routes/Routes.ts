import {Express} from 'express';
import {Server} from '../server';

import DevicesController from './controllers/Devices/DevicesController';
import EventsController from './controllers/Events/EventsController';
import MediaController from './controllers/Media/MediaController';
import TestController from './controllers/Test/TestController';
import {LocalOnly} from '../utils/LocalOnly';

export abstract class Routes {
  public static Register(): void {
    Server.App.use('/devices', DevicesController);
    Server.App.use('/events', EventsController);
    Server.App.use('/media', MediaController);
    Server.App.use('/test', LocalOnly, TestController);
  }
}
