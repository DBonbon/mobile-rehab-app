// utils/simple-mock.js
const simpleMock = {
    // Creates a simple mock title
    createTitle() {
      return "Mock Title";
    },
    
    // Creates a simple mock subtitle
    createSubtitle() {
      return "Mock Subtitle";
    },
    
    // Creates mock data for PageTitle component
    createPageTitleProps() {
      return {
        title: this.createTitle(),
        subtitle: this.createSubtitle()
      };
    }
  };
  
  module.exports = simpleMock;