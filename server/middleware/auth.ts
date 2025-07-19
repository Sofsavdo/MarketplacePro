import { Request, Response, NextFunction } from 'express';
import { User } from '../../shared/schema.js';

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    userRole?: string;
    user?: User;
  }
}

export interface AuthRequest extends Request {
  user?: User;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.session?.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!req.session?.userRole || !roles.includes(req.session.userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.session?.userId) {
    // req.user will be populated by route handlers if needed
  }
  next();
};