import {Router} from 'express';
import {createEventTests, deleteEventTests} from './EventTests';

const api = Router();

api.route('/events').post(createEventTests).delete(deleteEventTests);


export = api;
