import {Request, Response, NextFunction} from 'express';
import {Events} from '../../../models/db/Event';
import ErrorResponse from '../../../models/api/Responses/ErrorResponse';
import { Server } from '../../../server';
import { Op } from 'sequelize';

export async function createEventTests(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> { 
    Server.sequelize.query(
      `SET FOREIGN_KEY_CHECKS = 0;`
    ).then(() => {
    Events.bulkCreate(req.body.events).then((eventsArray) => {
      Server.sequelize.query(
        `SET FOREIGN_KEY_CHECKS = 1`
      ).then(() => {

        Events.findAll({where: { time: { [Op.lte]: 930317922 } }}).then(eventBodys => {
          let events = eventBodys.sort((a, b) => a.dataValues.time - b.dataValues.time).map(e => e.dataValues);
          res.status(200).json({message: "Successfully created test data!", data: events })
        })
      });
    }).catch((err) => {
      Server.sequelize.query(
        `SET FOREIGN_KEY_CHECKS = 1`
      ).then(() => {
        res.status(500).json(new ErrorResponse(500, "An error occured creating test data!", { error: err }));
        Server.Logs.error("An error occured creating test data - " + err)
      });
    });
    });
  }

  export async function deleteEventTests(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> { 
    Server.sequelize.query(`DELETE FROM EventsCam WHERE time <= 930317922`).then(() => {
      res.status(200).json({message: "Successfully deleted test data!"})
    }).catch((err) => {
      res.status(500).json(new ErrorResponse(500, "An error occured deleting test data!", { error: err }));
    });
  }