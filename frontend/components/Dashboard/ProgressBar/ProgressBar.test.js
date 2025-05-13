import { render, /* screen */ } from '@testing-library/react';
import ProgressBar from '.';
// import data from './ProgressBar.data';

describe('<ProgressBar />', () => {
    it('Renders an empty ProgressBar', () => {
        render(<ProgressBar />);
    });

    // it('Renders ProgressBar with data', () => {
    //     const { container } = render(<ProgressBar {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
