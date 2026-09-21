import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ElapsedTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startedAt = Date.now();

    return next.handle().pipe(
      map((data: unknown) => {
        const elapsedTime = Date.now() - startedAt;
        const contextType = context.getType<string>();

        if (contextType === 'graphql') {
          const gqlContext = GqlExecutionContext.create(context).getContext<{
            req?: Request;
            res?: Response;
          }>();

          const request = gqlContext.req;
          const response = gqlContext.res;

          console.log(
            `${request?.method ?? 'GRAPHQL'} ${
              request?.originalUrl ?? '/graphql'
            } - ${elapsedTime} ms`,
          );

          response?.setHeader('X-Elapsed-Time', `${elapsedTime} ms`);

          return data;
        }

        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest<Request>();
        const response = httpContext.getResponse<Response>();

        console.log(
          `${request.method} ${request.originalUrl} - ${elapsedTime} ms`,
        );

        if (request.originalUrl.startsWith('/api/')) {
          response.setHeader('X-Elapsed-Time', `${elapsedTime} ms`);

          return data;
        }

        if (data !== null && typeof data === 'object' && !Array.isArray(data)) {
          return {
            ...(data as Record<string, unknown>),
            serverElapsedTime: elapsedTime,
          };
        }

        return data;
      }),
    );
  }
}
