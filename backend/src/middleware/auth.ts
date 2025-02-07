import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DUMMY_JWT_SECRET } from '../constants';

const JWT_SECRET = process.env.JWT_SECRET || DUMMY_JWT_SECRET;

interface JwtPayload {
  userId: string;
  username: string;
}

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
      req.user = decoded as JwtPayload;
    } else {
      return res.status(403).json({ error: 'Invalid token structure.' });
    }
    next();
  });
};
