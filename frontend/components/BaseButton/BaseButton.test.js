import { render, /* screen */ } from '@testing-library/react';
import BaseButton from './';
// import data from './BaseButton.data';

describe('<BaseButton />', () => {
    it('Renders an empty BaseButton', () => {
        render(<BaseButton />);
    });

    // it('Renders BaseButton with data', () => {
    //     const { container } = render(<BaseButton {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
