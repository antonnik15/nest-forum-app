import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === 400) {
      const errorsResponse = { errorsMessages: [] };
      const excResponse: any = exception.getResponse();
      errorsResponse.errorsMessages.push(excResponse.message);
      response.status(status).json(errorsResponse);
      return;
    }
    response.status(status).json({
      statusCode: status,
      path: request.url,
    });
  }
}
