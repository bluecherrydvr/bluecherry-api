import {Express} from 'express';
import {Server} from '../server';

import DevicesController from './controllers/Devices/DevicesController';
import EventsController from './controllers/Events/EventsController';
import MediaController from './controllers/Media/MediaController';


export abstract class Routes {
  public static Register(): void {
    Server.App.use('/devices', DevicesController);
    Server.App.use('/events', EventsController);
    Server.App.use('/media', MediaController);
  }
}
