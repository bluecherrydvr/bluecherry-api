import Devices from './db/Device';

export abstract class Models {
  public static Initialize(): void {
    Devices.Register();
  }
}

export default {Devices};
