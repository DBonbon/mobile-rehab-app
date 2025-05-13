// utils/simple-mock.test.js
const simpleMock = require('./simple-mock');

describe('simpleMock utility', () => {
  test('creates a title string', () => {
    const title = simpleMock.createTitle();
    expect(typeof title).toBe('string');
    expect(title.length).toBeGreaterThan(0);
  });
  
  test('creates a subtitle string', () => {
    const subtitle = simpleMock.createSubtitle();
    expect(typeof subtitle).toBe('string');
    expect(subtitle.length).toBeGreaterThan(0);
  });
  
  test('creates PageTitle props object', () => {
    const props = simpleMock.createPageTitleProps();
    expect(props).toHaveProperty('title');
    expect(props).toHaveProperty('subtitle');
  });
});