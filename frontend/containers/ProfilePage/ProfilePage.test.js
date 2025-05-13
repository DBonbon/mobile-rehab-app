import { render, /* screen */ } from '@testing-library/react';
import ProfilePage from './';
// import data from './ProfilePage.data';

describe('<ProfilePage />', () => {
    it('Renders an empty ProfilePage', () => {
        render(<ProfilePage />);
    });

    // it('Renders ProfilePage with data', () => {
    //     const { container } = render(<ProfilePage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
