export type Locale = 'IN' | 'US';
export type Curriculum = 'CBSE' | 'COMMON_CORE';
export type Currency = 'INR' | 'USD';

export interface LocaleConfig {
  code: Locale;
  name: string;
  currency: Currency;
  supportedCurricula: Curriculum[];
  defaultCurriculum: Curriculum;
}

export const LOCALE_CONFIGS: Record<Locale, LocaleConfig> = {
  IN: {
    code: 'IN',
    name: 'India',
    currency: 'INR',
    supportedCurricula: ['CBSE'],
    defaultCurriculum: 'CBSE'
  },
  US: {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    supportedCurricula: ['COMMON_CORE'],
    defaultCurriculum: 'COMMON_CORE'
  }
};

export const DEFAULT_LOCALE: Locale = 'IN';

export const CURRICULUM_LABELS: Record<Curriculum, string> = {
  CBSE: 'CBSE',
  COMMON_CORE: 'Common Core'
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: '₹',
  USD: '$'
};