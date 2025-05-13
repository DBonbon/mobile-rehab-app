import { render, /* screen */ } from '@testing-library/react';
import TriangleAvatar from './';
// import data from './TriangleAvatar.data';

describe('<TriangleAvatar />', () => {
    it('Renders an empty TriangleAvatar', () => {
        render(<TriangleAvatar />);
    });

    // it('Renders TriangleAvatar with data', () => {
    //     const { container } = render(<TriangleAvatar {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
