// NotFoundPage.test.js
import React from 'react';
import { renderWithContext } from '../../test-utils/test-wrapper';
import NotFoundPage from './NotFoundPage';
import { getComponentProps } from '../../utils/testUtils';

describe('<NotFoundPage />', () => {
  it('renders NotFoundPage', () => {
    const mockProps = getComponentProps(NotFoundPage);
    
    const { container } = renderWithContext(<NotFoundPage />, {
      pageContextProps: mockProps
    });
    
    expect(container.firstChild).not.toBeNull();
  });
});