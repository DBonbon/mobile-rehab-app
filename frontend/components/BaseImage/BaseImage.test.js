import { render } from '@testing-library/react';
import BaseImage from './';
// Import from testUtils instead of directly from mocks
import { mockBaseImage } from '../../utils/testUtils';

describe('<BaseImage />', () => {
  it('Renders with mock data', () => {
    render(<BaseImage image={mockBaseImage} />);
  });
});
    // it('Renders BaseImage with data', () => {
    //     const { container } = render(<BaseImage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
