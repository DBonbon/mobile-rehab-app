// __mocks__/containers/dynamicMockData.js
// Base mock values for simple types
export const simpleMockValues = {
    string: "Test String",
    number: 42,
    boolean: true,
    function: () => {},
    symbol: Symbol("test"),
    null: null,
    undefined: undefined
  };
  
  // Generate array of specified type
  export function generateArray(itemType = 'object', length = 2) {
    const result = [];
    for (let i = 0; i < length; i++) {
      result.push(generateValue(itemType, `item-${i}`));
    }
    return result;
  }
  
  // Generate mock object with specified shape
  export function generateObject(shape = {}) {
    if (!shape || Object.keys(shape).length === 0) {
      // Default shape for empty object
      return {
        id: generateValue('string'),
        name: generateValue('string'),
        value: generateValue('number')
      };
    }
    
    const result = {};
    Object.entries(shape).forEach(([key, type]) => {
      result[key] = generateValue(type, key);
    });
    return result;
  }
  
  // Generate any value based on type specification
  export function generateValue(type, prefix = '') {
    // Handle array type specification
    if (typeof type === 'string' && type.endsWith('[]')) {
      const itemType = type.substring(0, type.length - 2);
      return generateArray(itemType);
    }
    
    // Handle object type specification
    if (typeof type === 'object' && type !== null) {
      return generateObject(type);
    }
    
    // Handle simple types
    if (simpleMockValues.hasOwnProperty(type)) {
      if (type === 'string') {
        return `${prefix ? prefix + ' ' : ''}${simpleMockValues.string}`;
      }
      return simpleMockValues[type];
    }
    
    // Default to object
    return generateObject();
  }
  
  // Generate props from propTypes definition or sample object
  export function generateProps(componentOrShape) {
    let propShape = {};
    
    // Handle component with propTypes
    if (componentOrShape.propTypes) {
      Object.entries(componentOrShape.propTypes).forEach(([propName, validator]) => {
        // Convert React PropTypes to our type system
        const type = getPropTypeAsString(validator);
        propShape[propName] = type;
      });
    } 
    // Handle plain object shape
    else if (typeof componentOrShape === 'object') {
      propShape = componentOrShape;
    }
    
    return generateObject(propShape);
  }
  
  // Helper to convert React PropType to string type
  function getPropTypeAsString(propType) {
    // This is a simplified version - in reality you'd need more complex logic
    // to determine PropTypes exactly
    
    if (!propType) return 'object';
    
    // Try to extract type from propType.name or type checking
    const typeStr = propType.type?.name || propType.name || '';
    
    if (typeStr.includes('shape')) return 'object';
    if (typeStr.includes('array')) return 'array';
    if (typeStr.includes('string')) return 'string';
    if (typeStr.includes('number')) return 'number';
    if (typeStr.includes('bool')) return 'boolean';
    if (typeStr.includes('func')) return 'function';
    
    // Default to object for complex or unknown types
    return 'object';
  }