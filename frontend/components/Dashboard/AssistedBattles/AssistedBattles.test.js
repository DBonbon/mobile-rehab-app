import { render, /* screen */ } from '@testing-library/react';
import AssistedBattles from './';
// import data from './AssistedBattles.data';

describe('<AssistedBattles />', () => {
    it('Renders an empty AssistedBattles', () => {
        render(<AssistedBattles />);
    });

    // it('Renders AssistedBattles with data', () => {
    //     const { container } = render(<AssistedBattles {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
