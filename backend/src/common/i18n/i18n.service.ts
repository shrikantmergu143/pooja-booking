import { Injectable } from '@nestjs/common';
import english = require('./locales/en/common.json');
import marathi = require('./locales/mr/common.json');

type LanguageCode = 'en' | 'mr';
const dictionaries: Record<LanguageCode, Record<string, string>> = { en: english, mr: marathi };

@Injectable()
export class I18nService {
  resolveLanguage(acceptLanguage?: string): LanguageCode {
    return acceptLanguage
      ?.split(',')[0]
      ?.trim()
      .toLowerCase()
      .startsWith('mr')
      ? 'mr'
      : 'en';
  }

  translate(message: string, acceptLanguage?: string): string {
    return dictionaries[this.resolveLanguage(acceptLanguage)][message] ?? message;
  }
}
