import {Request, Response, NextFunction} from 'express';
import {Server} from '../server';

// Your custom "middleware" function:
export function logRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  Server.Logs.debug(
    `${req.ip} - ${new Date(Date.now()).toISOString()} "${req.method} ${req.path} HTTP/${req.httpVersion}"`
  );
  next();
}
