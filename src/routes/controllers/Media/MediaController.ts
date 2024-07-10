import {Router} from 'express';
import { getMedia } from './GetMedia';

const api = Router();

api.route('/:mediaId').get(getMedia);

export = api;
