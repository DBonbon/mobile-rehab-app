import { render, /* screen */ } from '@testing-library/react';
import TestImage from './';
// import data from './TestImage.data';

describe('<TestImage />', () => {
    it('Renders an empty TestImage', () => {
        render(<TestImage />);
    });

    // it('Renders TestImage with data', () => {
    //     const { container } = render(<TestImage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
