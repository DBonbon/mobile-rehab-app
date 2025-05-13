import { render, /* screen */ } from '@testing-library/react';
import SEOInfo from './';
// import data from './SEOInfo.data';

describe('<SEOInfo />', () => {
    it('Renders an empty SEOInfo', () => {
        render(<SEOInfo />);
    });

    // it('Renders SEOInfo with data', () => {
    //     const { container } = render(<SEOInfo {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
