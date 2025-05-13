import { render, /* screen */ } from '@testing-library/react';
import BaseCard from './';
// import data from './BaseCard.data';

describe('<BaseCard />', () => {
    it('Renders an empty BaseCard', () => {
        render(<BaseCard />);
    });

    // it('Renders BaseCard with data', () => {
    //     const { container } = render(<BaseCard {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
