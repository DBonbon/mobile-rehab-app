// Save this as utils/mockFactory.test.js
const mockFactory = require('./mockFactory');

describe('Dynamic Mock Factory', () => {
  it('creates appropriate mock props for PageTitle', () => {
    const props = mockFactory.createMockProps('PageTitle');
    expect(props.title).toBeDefined();
    expect(props.subtitle).toBeDefined();
    expect(props.description).toBeDefined();
  });

  it('creates appropriate mock props for unknown components', () => {
    const props = mockFactory.createMockProps('UnknownComponent');
    expect(props.children).toBeDefined();
  });
});