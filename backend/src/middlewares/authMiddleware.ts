import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '../types';
import prisma from '../services/prisma';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    phone: string;
    email?: string | null;
    role: string;
    name: string;
    location: string;
    language: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'kisanconnect_super_secret_jwt_key_2026';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        phone: true,
        email: true,
        role: true,
        name: true,
        location: true,
        language: true,
      },
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid or expired user session.' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export const requireRole = (roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    if (!roles.includes(req.user.role as Role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to roles [${roles.join(', ')}].`,
      });
      return;
    }

    next();
  };
};
