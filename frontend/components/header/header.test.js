import { render, /* screen */ } from '@testing-library/react';
import header from './';
// import data from './header.data';

describe('<header />', () => {
    it('Renders an empty header', () => {
        render(<header />);
    });

    // it('Renders header with data', () => {
    //     const { container } = render(<header {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
