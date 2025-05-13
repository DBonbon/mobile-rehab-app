// utils/mockDataFactory.js
const mockDataFactory = {
    text(length = 10) {
      return 'Lorem ipsum dolor sit amet'.substring(0, length);
    },
    
    // Component-specific generators
    generateForComponent(componentName) {
      switch(componentName) {
        case 'PageTitle':
          return {
            title: this.text(20),
            subtitle: this.text(30)
          };
        default:
          return {};
      }
    }
  };
  
  export default mockDataFactory;