// __mocks__/containers/mockDataByType.js
import { mockSeoData } from '../__mocks__/seoMockData';
import { mockLanguageData } from '../__mocks__/components/languageSwitcher/languageMockData';

export const mockDataByType = {
  string: "Test string",
  number: 42,
  boolean: true,
  array: [],
  object: {},
  seoObject: mockSeoData.default,  // Use global SEO data
  localeObject: mockLanguageData  // Use global language data
};  canonicalLink: "https://test.com"

// Simple mock data generator function
export function generateMockData(schema) {
  // Handle array schema: [itemSchema, count]
  if (Array.isArray(schema) && schema.length === 2 && typeof schema[1] === 'number') {
    const [itemSchema, count] = schema;
    return Array.from({ length: count }, () => generateMockData(itemSchema));
  }
  
  // Handle object schema
  if (typeof schema === 'object' && schema !== null) {
    const result = {};
    for (const [key, type] of Object.entries(schema)) {
      result[key] = mockDataByType[type] || `Mock ${type}`;
    }
    return result;
  }
  
  // Handle primitive type
  return mockDataByType[schema] || {};
}