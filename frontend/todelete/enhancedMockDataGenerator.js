// __mocks__/containers/enhancedMockDataGenerator.js
import { mockDataByType } from '../__mocks__/containers/mockDataByType';
import { mockRegistry, complexTypeDefinitions } from './mocksRegistry';
/**
 * Enhanced mock data generator that supports complex types
 * and component-specific schemas
 */
export function generateEnhancedMockData(schema, options = {}) {
  // Handle array shorthand notation: [itemSchema, count]
  if (Array.isArray(schema) && schema.length === 2 && typeof schema[1] === 'number') {
    const [itemSchema, count] = schema;
    return Array.from({ length: count }, () => generateEnhancedMockData(itemSchema, options));
  }

  // Handle primitive types
  if (typeof schema === 'string') {
    // Check if it's an optional field (ends with ?)
    const isOptional = schema.endsWith('?');
    const baseType = isOptional ? schema.slice(0, -1) : schema;
    
    // For optional fields, randomly decide to include it or not
    if (isOptional && Math.random() > 0.7) {
      return null;
    }
    
    // Handle primitive types
    return mockDataByType[baseType] || `Mock ${baseType}`;
  }

  // Handle objects
  if (schema && typeof schema === 'object') {
    // Special schema types
    if (schema._schemaType) {
      switch (schema._schemaType) {
        case 'oneOf':
          // Select one option randomly from the array
          return schema._options[Math.floor(Math.random() * schema._options.length)];
          
        case 'union':
          // Select one variant randomly from the array of possible types
          const selectedVariant = schema._variants[Math.floor(Math.random() * schema._variants.length)];
          return generateEnhancedMockData(selectedVariant, options);
          
        case 'recursiveArray':
          // Handle recursive structures with depth control
          const depth = options.currentDepth || 0;
          if (depth >= (schema._depth || 1)) {
            return []; // Max depth reached, return empty array
          }
          
          // Determine count - either fixed or random within range
          let count;
          if (Array.isArray(schema._count)) {
            const [min, max] = schema._count;
            count = Math.floor(Math.random() * (max - min + 1)) + min;
          } else {
            count = schema._count || 1;
          }
          
          // Generate items with incremented depth
          const nextOptions = { ...options, currentDepth: depth + 1 };
          let baseType = schema._baseType;
          
          // Handle self-references
          if (baseType === 'self' && options.parentSchema) {
            baseType = options.parentSchema;
          }
          
          return Array.from({ length: count }, () => 
            generateEnhancedMockData(baseType, nextOptions)
          );
          
        default:
          return mockDataByType.object;
      }
    }
    
    // Regular object - process each property
    const result = {};
    for (const [key, value] of Object.entries(schema)) {
      result[key] = generateEnhancedMockData(value, {
        ...options,
        parentSchema: schema,
        currentKey: key
      });
    }
    return result;
  }
  
  // Fallback
  return mockDataByType.object;
}

/**
 * Get a complex type definition by name, with optional customizations
 */
export function getComplexTypeDefinition(typeName, customizations = {}) {
  const baseDefinition = complexTypeDefinitions[typeName];
  if (!baseDefinition) {
    console.warn(`No complex type definition found for: ${typeName}`);
    return mockDataByType.object;
  }
  
  // Deep merge customizations with base definition
  return deepMerge(baseDefinition, customizations);
}

/**
 * Helper to deep merge objects
 */
function deepMerge(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = deepMerge(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}