import express from 'express';
import cors from 'cors';
import {json} from 'body-parser';
import {Logger, getLogger, configure} from 'log4js';
import {logRequest} from './utils/logging';

import swaggerUi from 'swagger-ui-express';

import {authenticate} from './utils/auth';
import {Routes} from './routes/Routes';

import swaggerSpec from './docs/apidoc';
import {Sequelize} from 'sequelize';
import {Models} from './models/Models';

export abstract class Server {
  public static Logs: Logger = getLogger('Blucherry API');
  public static App = express();
  public static sequelize: Sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      define: {timestamps: false},
      logging: msg => getLogger('Sequelize').trace(msg),
    }
  );

  public static Initialize(): void {
    configure({
      appenders: {
        bcapi: {type: 'dateFile', filename: 'logs/bluecherry-api.logs'},
        console: {
          type: 'console',
          layout: {
            type: 'pattern',
            pattern: '%[%d{yyyy-MM-dd hh:mm:ss} [%c] %-5p - %m%]',
          },
        },
      },
      categories: {
        default: {
          appenders: ['bcapi', 'console'],
          level: 'trace',
        },
      },
    });

    this.App.use('/', cors(), json(), logRequest, authenticate);
    this.App.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    this.sequelize
      .authenticate()
      .then(() => this.Logs.info('Connected to the database!'))
      .catch(err => {
        this.Logs.fatal('Unable to connect to the database:', err);
        process.abort();
      }); //-> Test database
  }

  public static Start(port: Number) {
    this.App.listen(port, () => {
      this.Logs.info(`Started Blucherry API on port: ${port}`);
      Models.Initialize();
      Routes.Register();
    });
  }
}
