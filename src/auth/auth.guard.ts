import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response } from 'express';
import type { SessionRequest } from 'supertokens-node/framework/express';
import Session from 'supertokens-node/recipe/session';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<SessionRequest>();
    const response = httpContext.getResponse<Response>();

    try {
      request.session = await Session.getSession(request, response);
      return true;
    } catch {
      throw new UnauthorizedException('Authentication required');
    }
  }
}
