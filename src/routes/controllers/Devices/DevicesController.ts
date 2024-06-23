import {Router} from 'express';
import {addDevice} from './AddDevice';
import {deleteDevice} from './DeleteDevice';

const api = Router();

api.route('/').post(addDevice);
api.route('/:deviceId').delete(deleteDevice);

export = api;
