import { render, /* screen */ } from '@testing-library/react';
import UserSection from '.';
// import data from './UserSection.data';

describe('<UserSection />', () => {
    it('Renders an empty UserSection', () => {
        render(<UserSection />);
    });

    // it('Renders UserSection with data', () => {
    //     const { container } = render(<UserSection {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
