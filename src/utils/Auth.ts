import {Request, Response, NextFunction} from 'express';
import {Server} from '../server';

// Your custom "middleware" function:
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const auth = {login: process.env.USERNAME, password: process.env.PASSWORD};

  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, password] = Buffer.from(b64auth, 'base64')
    .toString()
    .split(':');

  if (login && password && login === auth.login && password === auth.password) {
    return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="401"');
  res.status(401).send('Authentication is required!');
}
