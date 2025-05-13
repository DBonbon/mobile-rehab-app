import { render, /* screen */ } from '@testing-library/react';
import EmailVerificationPage from './';
// import data from './EmailVerificationPage.data';

describe('<EmailVerificationPage />', () => {
    it('Renders an empty EmailVerificationPage', () => {
        render(<EmailVerificationPage />);
    });

    // it('Renders EmailVerificationPage with data', () => {
    //     const { container } = render(<EmailVerificationPage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
