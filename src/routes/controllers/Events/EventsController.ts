import {Router} from 'express';
import {getEvent, getEvents} from './GetEvent';

const api = Router();

api.route('/:eventId').get(getEvent);
api.route('/').get(getEvents);

export = api;
