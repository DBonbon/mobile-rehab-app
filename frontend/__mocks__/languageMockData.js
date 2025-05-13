// __mocks__/components/languageSwitcher/languageMockData.js

export const mockLocales = [
    { languageCode: 'en', languageName: 'English' },
    { languageCode: 'fr', languageName: 'French' },
    { languageCode: 'de', languageName: 'German' },
    { languageCode: 'es', languageName: 'Spanish' }
  ];
  
  export const mockCurrentLocale = 'en';
  
  export const mockCountryMapping = {
    en: 'gb', // UK flag for English
    fr: 'fr', // France flag
    de: 'de', // Germany flag
    es: 'es'  // Spain flag
  };
  
  export const mockTranslations = {
    en: {
      welcome: "Welcome",
      goodbye: "Goodbye"
    },
    fr: {
      welcome: "Bienvenue",
      goodbye: "Au revoir"
    },
    de: {
      welcome: "Willkommen",
      goodbye: "Auf Wiedersehen"
    },
    es: {
      welcome: "Bienvenido",
      goodbye: "Adiós"
    }
  };
  
  // Consolidated export
  export const mockLanguageData = {
    locales: mockLocales,
    currentLocale: mockLocales.find(locale => locale.languageCode === mockCurrentLocale) || mockLocales[0],
    countryMapping: mockCountryMapping,
    translations: mockTranslations
  };
  