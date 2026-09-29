import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import supertokens from 'supertokens-node';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';
import UserRoles from 'supertokens-node/recipe/userroles';
import {
  AUTH_MODULE_OPTIONS,
  type AuthModuleOptions,
} from './auth-options.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuperTokensService implements OnModuleInit {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly options: AuthModuleOptions,
    private readonly prisma: PrismaService,
  ) {
    supertokens.init({
      framework: 'express',

      supertokens: {
        connectionURI: this.options.connectionUri,
        apiKey: this.options.apiKey,
      },

      appInfo: {
        appName: this.options.appName,
        apiDomain: this.options.appUrl,
        websiteDomain: this.options.appUrl,
        apiBasePath: '/auth',
        websiteBasePath: '/auth',
      },

      recipeList: [
        EmailPassword.init({
          override: {
            functions: (originalImplementation) => ({
              ...originalImplementation,

              signUp: async (input) => {
                const response = await originalImplementation.signUp(input);

                if (response.status === 'OK') {
                  const email = response.user.emails[0];

                  if (email) {
                    await this.linkExistingCustomer(response.user.id, email);
                  }

                  await UserRoles.addRoleToUser(
                    'public',
                    response.user.id,
                    'USER',
                  );
                }

                return response;
              },
            }),
          },
        }),

        Session.init(),

        UserRoles.init(),
      ],
    });
  }

  async onModuleInit() {
    await UserRoles.createNewRoleOrAddPermissions('USER', []);

    await UserRoles.createNewRoleOrAddPermissions('ADMIN', []);
  }

  private async linkExistingCustomer(authUserId: string, email: string) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        email,
      },
    });

    if (!customer) {
      return;
    }

    if (customer.authUserId === authUserId) {
      return;
    }

    await this.prisma.customer.update({
      where: {
        id: customer.id,
      },
      data: {
        authUserId,
      },
    });
  }
}
