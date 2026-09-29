import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Response } from 'express';
import type { SessionRequest } from 'supertokens-node/framework/express';
import Session from 'supertokens-node/recipe/session';

@Injectable()
export class AuthRedirectMiddleware implements NestMiddleware {
  async use(request: SessionRequest, response: Response, next: NextFunction) {
    try {
      const session = await Session.getSession(request, response, {
        sessionRequired: false,
      });

      if (!session) {
        response.redirect('/auth/login');
        return;
      }

      request.session = session;
      next();
    } catch {
      response.redirect('/auth/login');
    }
  }
}
