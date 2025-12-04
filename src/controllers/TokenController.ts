import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { UpsertPushTokenService } from '../services/UpsertPushTokenService';
import { pushTokenSchema } from '../validators/pushTokenSchema';

export class TokenController {
  constructor(private readonly upsertPushTokenService: UpsertPushTokenService) {}

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

      const payload = pushTokenSchema.parse(request.body);
      const result = await this.upsertPushTokenService.execute({
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
