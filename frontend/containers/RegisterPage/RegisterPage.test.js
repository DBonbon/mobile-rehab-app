import { render, /* screen */ } from '@testing-library/react';
import RegisterPage from './';
// import data from './RegisterPage.data';

describe('<RegisterPage />', () => {
    it('Renders an empty RegisterPage', () => {
        render(<RegisterPage />);
    });

    // it('Renders RegisterPage with data', () => {
    //     const { container } = render(<RegisterPage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
