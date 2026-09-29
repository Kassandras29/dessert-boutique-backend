import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Response } from 'express';
import type { SessionRequest } from 'supertokens-node/framework/express';
import Session from 'supertokens-node/recipe/session';
import UserRoles from 'supertokens-node/recipe/userroles';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthViewContextMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(request: SessionRequest, response: Response, next: NextFunction) {
    try {
      const session = await Session.getSession(request, response, {
        sessionRequired: false,
      });

      if (!session) {
        response.locals.user = null;
        next();
        return;
      }

      request.session = session;

      const customer = await this.prisma.customer.findUnique({
        where: {
          authUserId: session.getUserId(),
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      const roles = await session.getClaimValue(UserRoles.UserRoleClaim);

      response.locals.user = customer
        ? { ...customer, isAdmin: roles?.includes('ADMIN') ?? false }
        : null;

      next();
    } catch {
      response.locals.user = null;
      next();
    }
  }
}
