import { render, /* screen */ } from '@testing-library/react';
import TaskSelector from './';
// import data from './TaskSelector.data';

describe('<TaskSelector />', () => {
    it('Renders an empty TaskSelector', () => {
        render(<TaskSelector />);
    });

    // it('Renders TaskSelector with data', () => {
    //     const { container } = render(<TaskSelector {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
