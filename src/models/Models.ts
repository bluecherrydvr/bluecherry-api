import Devices from './db/Device';
import Events from './db/Event';


export abstract class Models {
  public static Initialize(): void {
    Devices.Register();
    Events.Register();
  }
}

export default {Devices, Events};
