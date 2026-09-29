import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { SessionRequest } from 'supertokens-node/framework/express';
import UserRoles from 'supertokens-node/recipe/userroles';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderOwnerOrAdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<SessionRequest>();

    if (!request.session) {
      throw new UnauthorizedException('Authentication required');
    }

    const roles = await request.session.getClaimValue(UserRoles.UserRoleClaim);

    if (roles?.includes('ADMIN')) {
      return true;
    }

    if (!roles?.includes('USER')) {
      throw new ForbiddenException('Access denied');
    }

    const orderId = Number(request.params.id);

    if (!Number.isInteger(orderId)) {
      throw new ForbiddenException('Access denied');
    }

    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        customer: {
          is: {
            authUserId: request.session.getUserId(),
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!order) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
