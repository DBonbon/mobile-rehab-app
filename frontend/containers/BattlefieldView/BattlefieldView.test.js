import { render, /* screen */ } from '@testing-library/react';
import BattlefieldView from './';
// import data from './BattlefieldView.data';

describe('<BattlefieldView />', () => {
    it('Renders an empty BattlefieldView', () => {
        render(<BattlefieldView />);
    });

    // it('Renders BattlefieldView with data', () => {
    //     const { container } = render(<BattlefieldView {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
