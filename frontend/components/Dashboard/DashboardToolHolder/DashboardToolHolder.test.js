import { render, /* screen */ } from '@testing-library/react';
import DashboardToolHolder from './';
// import data from './DashboardToolHolder.data';

describe('<DashboardToolHolder />', () => {
    it('Renders an empty DashboardToolHolder', () => {
        render(<DashboardToolHolder />);
    });

    // it('Renders DashboardToolHolder with data', () => {
    //     const { container } = render(<DashboardToolHolder {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
