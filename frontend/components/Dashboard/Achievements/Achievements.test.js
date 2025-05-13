import { render, /* screen */ } from '@testing-library/react';
import Achievements from './';
// import data from './Achievements.data';

describe('<Achievements />', () => {
    it('Renders an empty Achievements', () => {
        render(<Achievements />);
    });

    // it('Renders Achievements with data', () => {
    //     const { container } = render(<Achievements {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
