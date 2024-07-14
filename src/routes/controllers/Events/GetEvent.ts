import {Request, Response, NextFunction} from 'express';
import ErrorResponse from '../../../models/api/Responses/ErrorResponse';
import {Events} from '../../../models/db/Event';
import {Server} from '../../../server';


//TODO: Add route to get event media from specfic device between date 1 and date 2. Also send back whether it was motion or continuious

export async function getEvent(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let eventId = req.params.eventId ?? -1;

  Events.findOne({where: {id: eventId}})
    .then(eventObject => {
      let event = eventObject.dataValues;

      Object.keys(event).forEach(function (key) {
        if (event[key] instanceof Buffer) event[key] = `${event[key]}`;
      });

      res
        .status(200)
        .set('Content-Type', 'application/json')
        .json({events: [EventBody(event)]});
    })
    .catch(err => {
      Server.Logs.error(
        `An error occured when getting event of ID ${eventId} - ${err}`
      );
      res
        .status(404)
        .send(
          new ErrorResponse(
            404,
            `A event with the ID ${eventId} was not found!`
          )
        );
      return;
    });
}

export async function getEvents(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let limit = /^\d+$/.test(String(req.query.limit))
    ? Number(req.query.limit)
    : 5;

  Events.findAll({limit: limit})
    .then(eventArray => {
      eventArray.forEach(eventObject => {
        let event = eventObject.dataValues;
        Object.keys(event).forEach(function (key) {
          if (event[key] instanceof Buffer) event[key] = `${event[key]}`;
        });
      });

      res
        .status(200)
        .set('Content-Type', 'application/json')
        .json({events: eventArray.map(e => EventBody(e))});
    })
    .catch(err => {
      Server.Logs.error(
        `An error occured when getting events from the server - ${err}`
      );
      res
        .status(404)
        .send(
          new ErrorResponse(
            404,
            `No events were found! If you are expecting results, please first check your bluecherry database. If there are events there, please contact the Bluecherry team along with log files.`
          )
        );
      return;
    });
}

export function EventBody(e: any) {
  let dateObj = new Date(e.time * 1000);
  let utcString = dateObj.toUTCString();
  let time = utcString.slice(-11, -4);
  return {
    id: e.id,
    date: time,
    mediaUrl: `https://${process.env.BC_HOST}/media/${e.media_id}`,
    duration: e.length - 3, // TODO: Investigate why times are awlways 3 seconds off
    // size:  e.size //TODO: Get file size
  };
}
