import { render, /* screen */ } from '@testing-library/react';
import CTA from '.';
// import data from './CTA.data';

describe('<CTA />', () => {
    it('Renders an empty CTA', () => {
        render(<CTA />);
    });

    // it('Renders CTA with data', () => {
    //     const { container } = render(<CTA {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
