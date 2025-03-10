import {Router} from 'express';
import {addDevice} from './AddDevice';
import {deleteDevice} from './DeleteDevice';
import {getDevice, getDevices} from './GetDevice';
import {updateDevice} from './UpdateDevice';
import {
    ptzContinuous,
    ptzAbsolute,
    ptzStop,
    getPtzPresets,
    gotoPreset,
    setPreset,
    ptzRelative,
    recordPattern,
    runPattern,
    getPtzStatus,
    getPtzConfiguration,
    setPtzConfiguration,
    setHomePosition,
    gotoHomePosition,
    getPtzLimits,
    setPtzLimits,
    deletePreset,
    renamePreset
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
api.route('/:deviceId/ptz/relative').post(ptzRelative);
api.route('/:deviceId/ptz/stop').post(ptzStop);

// PTZ preset routes
api.route('/:deviceId/ptz/presets').get(getPtzPresets);
api.route('/:deviceId/ptz/preset').post(gotoPreset);
api.route('/:deviceId/ptz/preset/set').post(setPreset);

// Pattern/Tour routes
api.route('/:deviceId/ptz/pattern/record').post(recordPattern);
api.route('/:deviceId/ptz/pattern/run').post(runPattern);

api.route('/:deviceId/ptz/status').get(getPtzStatus);
api.route('/:deviceId/ptz/config').get(getPtzConfiguration);
api.route('/:deviceId/ptz/config').put(setPtzConfiguration);
api.route('/:deviceId/ptz/home').post(setHomePosition);
api.route('/:deviceId/ptz/home/goto').post(gotoHomePosition);
api.route('/:deviceId/ptz/limits').get(getPtzLimits);
api.route('/:deviceId/ptz/limits').put(setPtzLimits);
api.route('/:deviceId/ptz/preset/:presetId').delete(deletePreset);
api.route('/:deviceId/ptz/preset/:presetId').put(renamePreset);

export = api;
