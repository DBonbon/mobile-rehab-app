import { render, /* screen */ } from '@testing-library/react';
import VerificationSentPage from './';
// import data from './VerificationSentPage.data';

describe('<VerificationSentPage />', () => {
    it('Renders an empty VerificationSentPage', () => {
        render(<VerificationSentPage />);
    });

    // it('Renders VerificationSentPage with data', () => {
    //     const { container } = render(<VerificationSentPage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
