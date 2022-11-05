import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getBearerTokenFromRequest } from 'src/shared/helpers';
import jwt from 'jsonwebtoken';
import config from 'config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const bearerToken = getBearerTokenFromRequest(req);

    req['user'] = jwt.verify(
      bearerToken || '',
      config.get<string>('jwt.scretKey'),
    );
    next();
  }
}
