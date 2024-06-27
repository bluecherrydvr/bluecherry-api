import {Router} from 'express';
import {addDevice} from './AddDevice';
import {deleteDevice} from './DeleteDevice';
import {getDevice, getDevices} from './GetDevice';

const api = Router();

api.route('/').post(addDevice);
api.route('/:format').get(getDevices);
api.route('/:deviceId/:format').get(getDevice);
api.route('/:deviceId').delete(deleteDevice);

export = api;
