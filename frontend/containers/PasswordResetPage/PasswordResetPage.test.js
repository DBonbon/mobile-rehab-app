import { render, /* screen */ } from '@testing-library/react';
import PasswordResetPage from './';
// import data from './PasswordResetPage.data';

describe('<PasswordResetPage />', () => {
    it('Renders an empty PasswordResetPage', () => {
        render(<PasswordResetPage />);
    });

    // it('Renders PasswordResetPage with data', () => {
    //     const { container } = render(<PasswordResetPage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
