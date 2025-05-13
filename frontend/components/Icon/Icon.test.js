import { render, /* screen */ } from '@testing-library/react';
import Icon from './';
// import data from './Icon.data';

describe('<Icon />', () => {
    it('Renders an empty Icon', () => {
        render(<Icon />);
    });

    // it('Renders Icon with data', () => {
    //     const { container } = render(<Icon {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
