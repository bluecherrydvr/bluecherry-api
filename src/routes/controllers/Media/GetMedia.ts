import {Request, Response, NextFunction} from 'express';
import ErrorResponse from '../../../models/api/Responses/ErrorResponse';
import {Media} from '../../../models/db/Media';
import {Server} from '../../../server';

export async function getMedia(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> { 
  let mediaId = req.params.mediaId ?? -1;
  
  Media.findOne({where: {id: mediaId}})
  .then(mediaObject => {
    let media = mediaObject.dataValues;
      res
        .set('Content-Type', 'video/mp4')
        .sendFile(media.filepath)
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

