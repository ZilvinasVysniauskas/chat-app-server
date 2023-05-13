import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export default (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      const error = new Error('Not authenticated.');
      (error as any).statusCode = 401;
      throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, 'somesupersecretsecret');
    } catch (err) {
      (err as any).statusCode = 500;
      throw err;
    }
    if (!decodedToken) {
      const error = new Error('Not authenticated.');
      (error as any).statusCode = 401;
      throw error;
    }
    req.userId = (decodedToken as any).userId;
    next();
  };