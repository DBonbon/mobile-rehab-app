import { render, /* screen */ } from '@testing-library/react';
import Dashboard from './';
// import data from './Dashboard.data';

describe('<Dashboard />', () => {
    it('Renders an empty Dashboard', () => {
        render(<Dashboard />);
    });

    // it('Renders Dashboard with data', () => {
    //     const { container } = render(<Dashboard {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
