import {Router} from 'express';
import {addDevice} from './AddDevice';

const api = Router();

api.route('/').post(addDevice);

export = api;
