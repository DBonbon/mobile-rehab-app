import * as React from 'react';

// Direct imports from mock files - no centralized index
export { mockBaseImage, mockCarouselImages, mockImageText } from '../__mocks__/components/images/imageData';
export { mockSidebarItems, mockEmptySidebarItems, mockNestedSidebarItems } from '../__mocks__/components/Sidebar/SidebarData';
export { defaultMockData } from '../__mocks__/globalMockData';
export { mockSeoData } from '../__mocks__/seoMockData';
export { 
  mockLanguageData, 
  mockLocales, 
  mockCurrentLocale, 
  mockCountryMapping, 
  mockTranslations 
} from '../__mocks__/languageMockData';

// Keep the existing functions
export function getComponentNameFromTestPath(testPath) {
  const match = testPath.match(/\/([^/]+)\/\1\.test\.js$/);
  return match ? match[1] : 'Unknown';
}

export function getComponentProps(Component) {
  const componentName = Component.displayName || Component.name;
  const unwrappedName = componentName.replace(/^Base\((.+)\)$/, '$1');
  
  if (componentName.includes('CategoriesPage') || unwrappedName === 'CategoriesPage') {
    return {};
  }
  
  const propTypes = Component.propTypes || {};
  const mockProps = {};
  
  Object.keys(propTypes).forEach(propName => {
    switch (propName) {
      case 'seo':
        mockProps.seo = mockSeoData.default;
        break;
      case 'locales':
        mockProps.locales = mockLanguageData.locales;
        break;
      case 'image':
        mockProps.image = mockBaseImage;
        break;
      case 'images':
        mockProps.images = mockCarouselImages;
        break;
      case 'SidebarItems':
        mockProps.SidebarItems = mockSidebarItems;
        break;
      default:
        mockProps[propName] = generateMockValue(propTypes[propName], propName);
    }
  });
  
  return mockProps;
}

function generateMockValue(propType, propName) {
  const typeName = propType?.name || '';
  
  switch (typeName) {
    case 'string':
      return `Mock ${propName}`;
    case 'number':
      return 42;
    case 'bool':
      return true;
    case 'array':
      return [];
    case 'object':
      return {};
    case 'arrayOf':
      return generateMockArray(propType, propName);
    case 'shape':
      return generateMockShape(propType, propName);
    default:
      return {};
  }
}

function generateMockArray(propType, propName) {
  if (propName.includes('article')) {
    return [{ title: 'Mock Article', slug: 'mock-article' }];
  }
  if (propName.includes('image')) {
    return mockCarouselImages;
  }
  if (propName.includes('Sidebar')) {
    return mockSidebarItems;
  }
  return [{ id: 1, name: `Mock ${propName}` }];
}

function generateMockShape(propType, propName) {
  if (propName.includes('image')) {
    return mockBaseImage;
  }
  return {};
}