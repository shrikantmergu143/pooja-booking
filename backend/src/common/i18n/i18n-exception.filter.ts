import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nService } from './i18n.service';

interface ExceptionResponse {
  message?: string | string[];
  [key: string]: unknown;
}

@Catch(HttpException)
export class I18nExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18nService: I18nService) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const exceptionResponse = exception.getResponse();
    const language = request.headers['accept-language'];
    const acceptLanguage = Array.isArray(language) ? language[0] : language;

    if (typeof exceptionResponse === 'string') {
      response.status(exception.getStatus()).json({
        statusCode: exception.getStatus(),
        message: this.i18nService.translate(exceptionResponse, acceptLanguage),
        error: exception.name,
      });
      return;
    }

    const body = exceptionResponse as ExceptionResponse;
    const message = Array.isArray(body.message)
      ? body.message.map((entry) => this.i18nService.translate(entry, acceptLanguage))
      : typeof body.message === 'string'
        ? this.i18nService.translate(body.message, acceptLanguage)
        : body.message;

    response.status(exception.getStatus()).json({ ...body, message });
  }
}
