import { render, /* screen */ } from '@testing-library/react';
import CurrentBattles from './';
// import data from './CurrentBattles.data';

describe('<CurrentBattles />', () => {
    it('Renders an empty CurrentBattles', () => {
        render(<CurrentBattles />);
    });

    // it('Renders CurrentBattles with data', () => {
    //     const { container } = render(<CurrentBattles {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
