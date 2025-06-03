import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../types/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'No token provided' });
    return;
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: UserRole };
    (req as any).user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
    return;
  }
}; 