import { render, /* screen */ } from '@testing-library/react';
import StandaloneCta from './';
// import data from './StandaloneCta.data';

describe('<StandaloneCta />', () => {
    it('Renders an empty StandaloneCta', () => {
        render(<StandaloneCta />);
    });

    // it('Renders StandaloneCta with data', () => {
    //     const { container } = render(<StandaloneCta {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
