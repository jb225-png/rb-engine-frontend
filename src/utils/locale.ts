import { Locale, Curriculum, Currency, LOCALE_CONFIGS, CURRENCY_SYMBOLS } from '../config/locales';

export const getDefaultCurriculum = (locale: Locale): Curriculum => {
  return LOCALE_CONFIGS[locale].defaultCurriculum;
};

export const getSupportedCurricula = (locale: Locale): Curriculum[] => {
  return LOCALE_CONFIGS[locale].supportedCurricula;
};

export const getCurrencyForLocale = (locale: Locale): Currency => {
  return LOCALE_CONFIGS[locale].currency;
};

export const formatCurrency = (amount: number, locale: Locale): string => {
  const currency = getCurrencyForLocale(locale);
  const symbol = CURRENCY_SYMBOLS[currency];
  return `${symbol}${amount.toLocaleString()}`;
};

export const isCurriculumValidForLocale = (curriculum: Curriculum, locale: Locale): boolean => {
  return LOCALE_CONFIGS[locale].supportedCurricula.includes(curriculum);
};

export const getGradeRangesForCurriculum = (curriculum: Curriculum): string[] => {
  switch (curriculum) {
    case 'CBSE':
      return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    case 'COMMON_CORE':
      return ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    default:
      return [];
  }
};