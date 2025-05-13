import { render, /* screen */ } from '@testing-library/react';
import PasswordResetConfirmPage from './';
// import data from './PasswordResetConfirmPage.data';

describe('<PasswordResetConfirmPage />', () => {
    it('Renders an empty PasswordResetConfirmPage', () => {
        render(<PasswordResetConfirmPage />);
    });

    // it('Renders PasswordResetConfirmPage with data', () => {
    //     const { container } = render(<PasswordResetConfirmPage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
