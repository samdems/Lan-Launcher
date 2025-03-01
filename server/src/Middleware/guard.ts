import jsonwebtoken from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AllRoles,Permissions, hasPermission } from '../roles.js';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export function jwt(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.header('auth-token');
  if (!token) return next();

  try {
    const secret = process.env.TOKEN_SECRET as string;
    const verified = jsonwebtoken.verify(token, secret);
    req.user = verified; // Now TypeScript recognizes 'user'
    next();
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
}


export const makeGuard = (name: keyof AllRoles, method: keyof Permissions) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const userRole = req.user?.role || 'anonymous';

    if (hasPermission(userRole, name, method)) {
      return next();
    }

    if (!userRole) {
      return res.status(401).send('Unauthorized');
    }

    res.status(403).send('Forbidden');
  };
};
