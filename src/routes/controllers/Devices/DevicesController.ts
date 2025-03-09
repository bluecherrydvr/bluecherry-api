import {Router} from 'express';
import {addDevice} from './AddDevice';
import {deleteDevice} from './DeleteDevice';
import {getDevice, getDevices} from './GetDevice';
import {updateDevice} from './UpdateDevice';
import {ptzContinuous, ptzAbsolute, ptzStop} from './PtzDevice';
import {
    ptzContinuous, 
    ptzAbsolute, 
    ptzStop,
    getPtzPresets,
    gotoPreset,
    setPreset
} from './PtzDevice';


const api = Router();

api.route('/').post(addDevice);
api.route('/:format').get(getDevices);
api.route('/:deviceId/:format').get(getDevice);
api.route('/:deviceId').delete(deleteDevice);
api.route('/:deviceId').put(updateDevice);

// PTZ routes
api.route('/:deviceId/ptz/continuous').post(ptzContinuous);
api.route('/:deviceId/ptz/absolute').post(ptzAbsolute); 
api.route('/:deviceId/ptz/stop').post(ptzStop);

// PTZ preset routes
api.route('/:deviceId/ptz/presets').get(getPtzPresets);
api.route('/:deviceId/ptz/preset').post(gotoPreset);
api.route('/:deviceId/ptz/preset/set').post(setPreset);

export = api;
