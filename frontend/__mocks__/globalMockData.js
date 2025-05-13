// __mocks__/globalMockData.js
import { mockSeoData } from './seoMockData';
import { mockLanguageData } from './languageMockData';

export const defaultMockData = {
  seo: mockSeoData.default,
  locales: mockLanguageData.locales,
  current_locale: mockLanguageData.currentLocale,
  country_mapping: mockLanguageData.countryMapping,
  translations: mockLanguageData.translations
};
