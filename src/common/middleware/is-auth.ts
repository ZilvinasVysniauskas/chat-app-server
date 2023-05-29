import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from 'express';
import { Socket } from 'socket.io';
interface AuthenticatedRequest extends Request {
  userId?: string;
}

export default (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    console.error('No authorization header');
    return res.status(401).json({ message: 'Not authenticated.' });
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'somesupersecretsecret');
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Not authenticated' });
  }
  req.userId = (decodedToken as any).userId;
  next();
};

export function isAuthorized(socket: Socket): boolean {
  console.log(socket.handshake.query);
  const token = socket.handshake.query.token as string;
  console.log('token: ' + token);
  try {
    jwt.verify(token, 'somesupersecretsecret');
  } catch (err) {
    console.error(err);
    socket.emit('error', 'Not authorized');
    return false;
  }
  console.log('socket authorized');
  return true;
}