import {Request, Response, NextFunction} from 'express';
import {Server} from '../server';

// Your custom "middleware" function:
export function LocalOnly(
  req: Request,
  res: Response,
  next: NextFunction
): void {
    if(req.ip.includes(process.env.BC_HOST))
        next();
    else
        res.status(401).send('Route not allowed on this connection!');
}
