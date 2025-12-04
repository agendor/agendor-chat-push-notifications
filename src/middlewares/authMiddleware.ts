import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

interface JWTPayload {
  account: string;
  user: string;
  exp?: number;
  [key: string]: unknown;
}

export const authMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
): Response | void => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return response.status(401).json({
        message: 'Unauthorized: Token not provided',
      });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      return response.status(401).json({
        message: 'Unauthorized: Invalid token format',
      });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return response.status(401).json({
        message: 'Unauthorized: Invalid token format',
      });
    }

    if (!env.jwtSecretKey) {
      throw new Error('JWT_SECRET_KEY not configured');
    }

    const decoded = jwt.verify(token, env.jwtSecretKey) as JWTPayload;

    if (!decoded.account) {
      return response.status(401).json({
        message: 'Unauthorized: account not found',
      });
    }

    if (!decoded.user) {
      return response.status(401).json({
        message: 'Unauthorized: user not found',
      });
    }

    request.auth = {
      accountId: decoded.account,
      userId: decoded.user,
    };

    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return response.status(401).json({
        message: 'Unauthorized: Invalid token',
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return response.status(401).json({
        message: 'Unauthorized: Token expired',
      });
    }

    return next(error);
  }
};
