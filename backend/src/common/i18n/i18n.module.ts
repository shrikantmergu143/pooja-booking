import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { I18nExceptionFilter } from './i18n-exception.filter';
import { I18nService } from './i18n.service';

@Global()
@Module({
  providers: [
    I18nService,
    {
      provide: APP_FILTER,
      useClass: I18nExceptionFilter,
    },
  ],
  exports: [I18nService],
})
export class I18nModule {}
