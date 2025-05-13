import { render, /* screen */ } from '@testing-library/react';
import BattlePage from './';
// import data from './BattlePage.data';

describe('<BattlePage />', () => {
    it('Renders an empty BattlePage', () => {
        render(<BattlePage />);
    });

    // it('Renders BattlePage with data', () => {
    //     const { container } = render(<BattlePage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
