// utils/enhancedTestUtils.js
import * as React from 'react';
import { mockDataByType } from '../__mocks__/containers/mockDataByType';
import { 
  generateEnhancedMockData,
  getComplexTypeDefinition
} from '../__mocks__/containers/enhancedMockDataGenerator';
import { mockRegistry } from '../__mocks__/mocksRegistry';

/**
 * Enhanced component props generator that leverages the registry system
 * and falls back to type-based inference when needed
 */
export function getEnhancedComponentProps(Component, customOverrides = {}) {
  // Get component name
  const componentName = Component.displayName || Component.name;
  
  // Check if we have a registered mock for this component
  const registeredMock = mockRegistry[componentName];
  if (registeredMock) {
    // Generate data from registered schema and apply overrides
    const generatedData = generateEnhancedMockData(registeredMock);
    return { ...generatedData, ...customOverrides };
  }
  
  // Fallback to prop-type based generation
  return getPropTypeBasedMockProps(Component, customOverrides);
}

/**
 * Enhanced prop-type based mock generator with improved type inference
 */
function getPropTypeBasedMockProps(Component, customOverrides = {}) {
  const propTypes = Component.propTypes || {};
  const mockProps = {};
  
  // Map over propTypes and create appropriate mock data
  Object.keys(propTypes).forEach(propName => {
    // Try to infer complex type based on prop name
    const complexType = inferComplexTypeFromPropName(propName);
    if (complexType) {
      mockProps[propName] = generateEnhancedMockData(
        getComplexTypeDefinition(complexType)
      );
      return;
    }
    
    // Handle based on PropType
    const propType = propTypes[propName];
    mockProps[propName] = generateMockForPropType(propType, propName);
  });
  
  // Apply custom overrides
  return { ...mockProps, ...customOverrides };
}

/**
 * Generate mock data for a specific PropType
 */
function generateMockForPropType(propType, propName) {
  // Get PropType name or default to unknown
  const propTypeName = propType?.name || propType?.type?.name || 'unknown';
  
  switch (propTypeName) {
    case 'string':
      return mockDataByType.string;
    case 'number':
      return mockDataByType.number;
    case 'bool':
      return mockDataByType.boolean;
    case 'func':
      return jest.fn();
    case 'array':
      return inferArrayContent(propName);
    case 'object':
      return inferObjectStructure(propName);
    case 'arrayOf':
      return inferArrayOfContent(propType, propName);
    case 'shape':
    case 'exact':
      return generateMockForShape(propType, propName);
    case 'oneOf':
    case 'oneOfType':
      return handleOneOfTypes(propType, propName);
    default:
      // Handle special common cases
      if (propName === 'seo' || propName.includes('seo')) {
        return generateEnhancedMockData(getComplexTypeDefinition('seoObject'));
      } else if (propName.includes('locale')) {
        return mockDataByType.localeObject;
      }
      // Default fallback
      return mockDataByType.object;
  }
}

/**
 * Infer complex type from prop name using naming conventions
 */
function inferComplexTypeFromPropName(propName) {
  const propNameLower = propName.toLowerCase();
  
  // Map prop names to complex types
  const typeMapping = {
    'streamblocks': 'streamBlock',
    'streamblock': 'streamBlock',
    'blocks': 'streamBlock',
    'navigation': 'navigationItem',
    'nav': 'navigationItem',
    'menu': 'navigationItem',
    'seo': 'seoObject'
  };
  
  // Check for exact matches
  if (typeMapping[propNameLower]) {
    return typeMapping[propNameLower];
  }
  
  // Check for partial matches
  for (const [pattern, type] of Object.entries(typeMapping)) {
    if (propNameLower.includes(pattern)) {
      return type;
    }
  }
  
  return null;
}

/**
 * Infer content structure for array prop based on name
 */
function inferArrayContent(propName) {
  const propNameLower = propName.toLowerCase();
  
  // Infer array content based on naming conventions
  if (propNameLower.includes('articles') || propNameLower.includes('posts')) {
    return generateEnhancedMockData([{
      title: 'string',
      slug: 'string',
      excerpt: 'string',
      image: {
        src: 'string',
        alt: 'string'
      },
      date: 'string',
      author: {
        name: 'string',
        avatar: 'string?'
      }
    }, 3]);
  }
  
  if (propNameLower.includes('images') || propNameLower.includes('gallery')) {
    return generateEnhancedMockData([{
      src: 'string',
      alt: 'string',
      width: 'number',
      height: 'number',
      caption: 'string?'
    }, 4]);
  }
  
  if (propNameLower.includes('navigation') || propNameLower.includes('menu')) {
    return generateEnhancedMockData([
      getComplexTypeDefinition('navigationItem'),
      3
    ]);
  }
  
  // Default array
  return mockDataByType.array;
}

/**
 * Infer object structure based on prop name
 */
function inferObjectStructure(propName) {
  const propNameLower = propName.toLowerCase();
  
  if (propNameLower.includes('image')) {
    return generateEnhancedMockData({
      src: 'string',
      alt: 'string',
      width: 'number',
      height: 'number'
    });
  }
  
  if (propNameLower.includes('author') || propNameLower.includes('user')) {
    return generateEnhancedMockData({
      id: 'number',
      name: 'string',
      email: 'string?',
      avatar: 'string?',
      role: 'string?'
    });
  }
  
  // Default object
  return mockDataByType.object;
}

/**
 * Handle arrayOf PropType
 */
function inferArrayOfContent(propType, propName) {
  // Try to extract valueType
  const valueType = propType.value || {};
  const valueTypeName = valueType.name || '';
  
  if (valueTypeName === 'shape') {
    // Generate mock for shape and wrap in array
    const shapeMock = generateMockForShape(valueType, propName);
    return [shapeMock, shapeMock, shapeMock];
  }
  
  // Fallback to inferred array content
  return inferArrayContent(propName);
}

/**
 * Generate mock for shape PropType
 */
function generateMockForShape(propType, propName) {
  // Extract shape definition if available
  const shapeObj = propType.value || {};
  if (!shapeObj || typeof shapeObj !== 'object') {
    return inferObjectStructure(propName);
  }
  
  // Build schema from shape definition
  const schema = {};
  Object.keys(shapeObj).forEach(key => {
    const fieldType = shapeObj[key];
    const fieldTypeName = fieldType?.name || 'unknown';
    
    switch (fieldTypeName) {
      case 'string':
        schema[key] = 'string';
        break;
      case 'number':
        schema[key] = 'number';
        break;
      case 'bool':
        schema[key] = 'boolean';
        break;
      case 'arrayOf':
        // Recursively handle nested arrayOf
        schema[key] = [inferObjectStructure(`${propName}_${key}`), 2];
        break;
      case 'shape':
        // Recursively handle nested shapes
        schema[key] = generateMockForShape(fieldType, `${propName}_${key}`);
        break;
      default:
        schema[key] = 'string';
    }
  });
  
  return generateEnhancedMockData(schema);
}

/**
 * Handle oneOf and oneOfType PropTypes
 */
function handleOneOfTypes(propType, propName) {
  // For oneOf (enum), select a random value
  if (propType.name === 'oneOf' && Array.isArray(propType.value)) {
    const options = propType.value;
    return options[Math.floor(Math.random() * options.length)];
  }
  
  // For oneOfType, select a type and generate mock
  if (propType.name === 'oneOfType' && Array.isArray(propType.value)) {
    const types = propType.value;
    // Pick a random type from options
    const selectedType = types[Math.floor(Math.random() * types.length)];
    return generateMockForPropType(selectedType, propName);
  }
  
  // Fallback to string
  return mockDataByType.string;
}

// Example usage in tests:
export function getComponentProps(Component, customOverrides = {}) {
  return getEnhancedComponentProps(Component, customOverrides);
}