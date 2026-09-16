import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Внутренняя ошибка сервера';

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const responseMessage = (
          exceptionResponse as {
            message?: string | string[];
          }
        ).message;

        if (responseMessage) {
          message = responseMessage;
        }
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = 'Запись с такими уникальными данными уже существует';
          break;

        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Запись не найдена';
          break;

        case 'P2003':
          status = HttpStatus.CONFLICT;
          message = 'Невозможно выполнить операцию из-за связанных данных';
          break;

        default:
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = 'Ошибка базы данных';
      }
    }

    const isApiRequest = request.originalUrl.startsWith('/api/');

    if (isApiRequest) {
      return response.status(status).json({
        statusCode: status,
        message,
        path: request.originalUrl,
        timestamp: new Date().toISOString(),
      });
    }

    const htmlMessage = Array.isArray(message) ? message.join(', ') : message;

    return response.status(status).render('error', {
      title: `Ошибка ${status}`,
      description: 'Ошибка при выполнении запроса',
      statusCode: status,
      message: htmlMessage,
    });
  }
}
