import { render, /* screen */ } from '@testing-library/react';
import Modal from './';
// import data from './Modal.data';

describe('<Modal />', () => {
    it('Renders an empty Modal', () => {
        render(<Modal />);
    });

    // it('Renders Modal with data', () => {
    //     const { container } = render(<Modal {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
