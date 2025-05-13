// Save this as utils/mockFactory.js
const createMockProps = (componentName) => {
    const generators = {
      PageTitle: () => ({
        title: 'Mock Page Title',
        subtitle: 'Mock Subtitle',
        description: 'Mock Description'
      }),
      Card: () => ({
        title: 'Mock Card Title',
        content: 'Mock Content',
        image: 'mock-image-url.jpg',
        isActive: true
      }),
      Button: () => ({
        label: 'Mock Button',
        onClick: jest.fn(),
        disabled: false,
        variant: 'primary'
      }),
      // Default generator for unknown components
      default: () => ({
        children: 'Mock Children Content'
      })
    };
  
    // Return the appropriate generator or default
    const generator = generators[componentName] || generators.default;
    return generator();
  };
  
  module.exports = {
    createMockProps
  };