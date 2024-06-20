import {Express} from 'express';
import {Server} from '../server';

import DevicesController from './controllers/Devices/DevicesController';

export abstract class Routes {
  public static Register(): void {
    Server.App.use('/devices', DevicesController);
  }
}
