import Devices from './db/Device';
import Events from './db/Event';
import Media from './db/Media';

export abstract class Models {
  public static Initialize(): void {
    Devices.Register();
    Events.Register();
    Media.Register();
  }
}

export default {Devices, Events};
