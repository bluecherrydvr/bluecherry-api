import {Request, Response, NextFunction} from 'express';
import ErrorResponse from '../../../models/api/Responses/ErrorResponse';
import {Events} from '../../../models/db/Event';
import {Media} from '../../../models/db/Media';
import {Server} from '../../../server';
import { EventBody } from '../Events/GetEvent';

export async function getMedia(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let mediaId = req.params.mediaId ?? -1;

  Media.findOne({where: {id: mediaId}})
    .then(async mediaObject => {
      Events.findOne({where: {media_id: mediaId}}).then(async eventObject => {
        let media = mediaObject.dataValues;
        let event = await EventBody(eventObject);
        res.set('Content-Type', 'video/mp4').set("Content-Duration", new Date(event.duration * 1000).toISOString().slice(11, 19)).sendFile(media.filepath);
      });
    })
    .catch(err => {
      Server.Logs.error(
        `An error occured when getting media of ID ${mediaId} - ${err}`
      );
      res
        .status(404)
        .send(
          new ErrorResponse(
            404,
            `A media with the ID ${mediaId} was not found!`
          )
        );
      return;
    });
}
