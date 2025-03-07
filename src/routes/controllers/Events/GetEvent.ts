import {Request, Response, NextFunction} from 'express';
import ErrorResponse from '../../../models/api/Responses/ErrorResponse';
import {Events} from '../../../models/db/Event';
import {Media} from '../../../models/db/Media';
import {Server} from '../../../server';
import fs from 'fs';
import {Op} from 'sequelize';

//TODO: Add route to get event media from specfic device between date 1 and date 2. Also send back whether it was motion or continuious

export async function getEvent(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let eventId = req.params.event ?? -1;

  Events.findOne({where: {id: eventId}})
    .then(async eventObject => {
      let event = eventObject.dataValues;

      Object.keys(event).forEach(function (key) {
        if (event[key] instanceof Buffer) event[key] = `${event[key]}`;
      });

      Media.findOne({where: {id: event.media_id}}).then(media => {
        let size = fs.statSync(media.dataValues.filepath).size;

        res
          .status(200)
          .set('Content-Type', 'application/json')
          .json({events: [{...EventBody(event), size: size}]});
      });
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

  let deviceId = req.query.device ?? -1;
  let startDate = req.query.start ?? -1;
  let endDate = req.query.end ?? -1;

  let where = {};

  if (deviceId != -1) {
    where = {...where, device_id: deviceId};
  }
  if (startDate != -1 && endDate != -1) {
    where = {
      ...where,
      [Op.and]: [
        {
          time: {
            [Op.gte]: startDate,
          },
        },
        {
          time: {
            [Op.lte]: endDate,
          },
        },
      ],
    };
  } else if (startDate != -1) {
    where = {
      ...where,
      time: {
        [Op.gte]: startDate,
      },
    };
  } else if (endDate != -1) {
    where = {
      ...where,
      time: {
        [Op.lte]: endDate,
      },
    };
  }

  Events.findAll({limit: limit, where: where})
    .then(async eventArray => {
      let mediaIds = eventArray.map(e => e.dataValues.media_id);

      Media.findAll({
        where: {
          id: {
            [Op.in]: mediaIds,
          },
        },
      }).then(mediaArrays => {
        let events = eventArray.map(event => {
          if (event.dataValues.media_id == null)
            return {...EventBody(event.dataValues), size: -1};
          else {
            let size = fs.statSync(
              mediaArrays.find(
                m => m.dataValues.id == event.dataValues.media_id
              ).dataValues.filepath
            ).size;
            return {...EventBody(event.dataValues), size: size};
          }
        });

        res
          .status(200)
          .set('Content-Type', 'application/json')
          .json({events: events});
      });
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
            `No events were found! If you are expecting results, please first check your bluecherry database. If there are events there, please contact the Bluecherry team along with log files.`,
            {searchQuery: {}}
          )
        );
      return;
    });
}

export function EventBody(e: any) {
  let dateObj = new Date(e.time * 1000);
  let utcString = dateObj.toUTCString();

  return {
    id: e.id,
    deviceId: e.device_id,
    date: utcString,
    mediaId: e.media_id,
    mediaUrl: `https://${process.env.BC_HOST}:${process.env.PORT}/media/${e.media_id}`,
    duration: e.length - 3, // TODO: Investigate why times are awlways 3 seconds off
    mode: e.type_id,
  };
}
