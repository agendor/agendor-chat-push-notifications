import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { UpsertTokenService } from '../services/UpsertTokenService';
import { tokenSchema } from '../validators/tokenSchema';

export class TokenController {
  constructor(private readonly upsertTokenService: UpsertTokenService) {}

  upsert = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      if (!request.auth?.accountId || !request.auth?.userId) {
        return response.status(401).json({
          message: 'Unauthorized: accountId or userId not found',
        });
      }

      const payload = tokenSchema.parse(request.body);
      const result = await this.upsertTokenService.execute({
        ...payload,
        accountId: request.auth.accountId,
        userId: request.auth.userId,
      });

      return response.status(result.created ? 201 : 200).json({
        data: {
          id: result.token.id,
          accountId: result.token.accountId,
          userId: result.token.userId,
          deviceId: result.token.deviceId,
          fcmToken: result.token.fcmToken,
          createdAt: result.token.createdAt,
          updatedAt: result.token.updatedAt,
        },
        meta: {
          created: result.created,
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return response.status(400).json({
          message: 'Invalid Data',
          errors: error.issues.map((issue: ZodIssue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }

      return next(error);
    }
  };
}
