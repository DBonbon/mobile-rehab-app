import { render, /* screen */ } from '@testing-library/react';
import BaseLink from './';
// import data from './BaseLink.data';

describe('<BaseLink />', () => {
    it('Renders an empty BaseLink', () => {
        render(<BaseLink />);
    });

    // it('Renders BaseLink with data', () => {
    //     const { container } = render(<BaseLink {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
