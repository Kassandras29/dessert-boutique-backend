import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';

import {
  AUTH_MODULE_OPTIONS,
  type AuthModuleOptions,
} from './auth-options.interface';

import { SuperTokensMiddleware } from './supertokens.middleware';
import { SuperTokensService } from './supertokens.service';
import { AuthGuard } from './auth.guard';
import { AuthPagesController } from './auth-pages.controller';
import { RolesGuard } from './roles.guard';
import { CustomerOwnerOrAdminGuard } from '../customers/customer-owner-or-admin.guard';
import { AuthViewContextMiddleware } from './auth-view-context.middleware';

@Module({})
export class AuthModule implements NestModule {
  static register(options: AuthModuleOptions): DynamicModule {
    if (!options.connectionUri) {
      throw new Error('SUPERTOKENS_CONNECTION_URI is not configured');
    }

    if (!options.apiKey) {
      throw new Error('SUPERTOKENS_API_KEY is not configured');
    }

    return {
      module: AuthModule,

      controllers: [AuthPagesController],

      providers: [
        {
          provide: AUTH_MODULE_OPTIONS,
          useValue: options,
        },
        SuperTokensService,
        AuthGuard,
        RolesGuard,
        CustomerOwnerOrAdminGuard,
        AuthViewContextMiddleware,
      ],

      exports: [
        SuperTokensService,
        AuthGuard,
        RolesGuard,
        CustomerOwnerOrAdminGuard,
      ],
    };
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SuperTokensMiddleware, AuthViewContextMiddleware)
      .forRoutes('*');
  }
}
