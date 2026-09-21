import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { createHash } from 'node:crypto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ETagInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType<string>() !== 'http') {
      return next.handle();
    }

    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    if (request.method !== 'GET' || !request.originalUrl.startsWith('/api/')) {
      return next.handle();
    }

    response.setHeader('Cache-Control', 'public, max-age=3600');

    return next.handle().pipe(
      map((data: unknown) => {
        const serializedData = JSON.stringify(data);

        const hash = createHash('sha1').update(serializedData).digest('hex');

        const etag = `"${hash}"`;

        response.setHeader('ETag', etag);

        const ifNoneMatch = request.get('If-None-Match');

        const normalizedIfNoneMatch = ifNoneMatch
          ?.replace(/^W\//, '')
          .replace(/^"|"$/g, '');

        if (normalizedIfNoneMatch === hash) {
          response.status(304);
          return undefined;
        }

        return data;
      }),
    );
  }
}
